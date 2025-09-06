const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Contact = require('./models/Contact');
const WebinarRegistration = require('./models/WebinarRegistration');
const Analytics = require('./models/Analytics');

// Import middleware
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Razorpay with hardcoded credentials
let razorpay = null;
// RAZORPAY_KEY_ID=rzp_live_RBwW40KxX2ChHW
// RAZORPAY_KEY_SECRET=59jWEo3NGn6k53NOFRj3xxt3
const RAZORPAY_KEY_ID = 'rzp_live_RBwW40KxX2ChHW';
const RAZORPAY_KEY_SECRET = '59jWEo3NGn6k53NOFRj3xxt3'; // Replace with actual secret

if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET && RAZORPAY_KEY_SECRET !== 'your_razorpay_live_secret_key_here') {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay initialized successfully with hardcoded credentials');
} else {
  console.log('⚠️  Razorpay not initialized - please update the hardcoded secret key');
}

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://vibecoding:vibecoding@vbcluster0.1c8ero3.mongodb.net/vibe-coding?retryWrites=true&w=majority&appName=vbCluster0";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('⚠️  Server will continue without MongoDB connection');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Vibe Coding Server is running!',
    timestamp: new Date().toISOString(),
    razorpay: razorpay ? 'Configured' : 'Not configured',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Authentication routes
app.post('/api/auth/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
app.get('/api/auth/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      subscription: req.user.subscription
    }
  });
});

// LinkedIn OAuth callback endpoint (called by LinkedIn) - FIXED VERSION
app.get('/linkedin-callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    console.log('LinkedIn Callback Debug:', {
      code: code ? 'Present' : 'Missing',
      state: state ? 'Present' : 'Missing',
      error: error || 'None',
      errorDescription: error_description || 'None'
    });

    // If no parameters at all, redirect to home
    if (!code && !error) {
      console.log('No OAuth parameters found, redirecting to home');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?error=no_oauth_params`);
    }

    if (error) {
      const errorMsg = error_description || error;
      console.error('LinkedIn OAuth error:', errorMsg);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?error=linkedin_auth_failed&message=${encodeURIComponent(errorMsg)}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?error=no_auth_code`);
    }

    // Exchange code for access token
    const defaultLinkedInRedirect = 'https://vibe-coding--library-management-806d9.asia-east1.hosted.app/linkedin-callback';
    let configuredRedirectUri = (process.env.LINKEDIN_REDIRECT_URI || defaultLinkedInRedirect).trim().replace(/^"|"$/g, '');
    if ([" ", "\n", "\r", "\t"].some(ch => configuredRedirectUri.includes(ch)) || configuredRedirectUri.includes('%')) {
      console.warn('Invalid characters found in LINKEDIN_REDIRECT_URI; falling back to default. Value was:', JSON.stringify(process.env.LINKEDIN_REDIRECT_URI));
      configuredRedirectUri = defaultLinkedInRedirect;
    }
    console.log('LinkedIn Token Exchange using redirect_uri:', configuredRedirectUri);
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: configuredRedirectUri
      })
    });

    console.log('Token Response Status:', tokenResponse.status);
    console.log('Token Response Headers:', Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token Exchange Error:', errorText);
      throw new Error(`Failed to exchange code for access token: ${tokenResponse.status} - ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token Data:', tokenData);
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('No access token received from LinkedIn');
    }

    // Get user profile from LinkedIn using OpenID Connect
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('Profile Response Status:', profileResponse.status);

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('Profile Fetch Error:', errorText);
      throw new Error(`Failed to fetch LinkedIn profile: ${profileResponse.status} - ${errorText}`);
    }

    const profileData = await profileResponse.json();
    console.log('LinkedIn Profile Data:', profileData);

    // Extract user information from OpenID Connect response
    const linkedinId = profileData.sub; // Subject identifier
    const name = profileData.name || 'LinkedIn User';
    const email = profileData.email || `linkedin_${linkedinId}@vibecoding.local`;
    const profilePicture = profileData.picture;

    // Create or find user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        password: '', // No password for OAuth users
        subscription: {
          type: 'free',
          isActive: false
        },
        linkedinId: linkedinId,
        profilePicture: profilePicture
      });

      await user.save();
    } else {
      // Update existing user with LinkedIn info if not already set
      if (!user.linkedinId) {
        user.linkedinId = linkedinId;
        user.profilePicture = profilePicture;
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with success and token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      profilePicture: user.profilePicture
    };
    const redirectUrl = `${frontendUrl}/?linkedin_success=true&token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    
    console.log('LinkedIn Success Redirect:', {
      frontendUrl,
      redirectUrl,
      userData
    });

    res.redirect(redirectUrl);

  } catch (error) {
    console.error('LinkedIn callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/?error=linkedin_callback_failed&message=${encodeURIComponent(error.message)}`);
  }
});

// LinkedIn OAuth authentication (for frontend API calls)
app.post('/api/auth/linkedin', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/linkedin-callback'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user profile from LinkedIn
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LinkedIn profile');
    }

    const profileData = await profileResponse.json();

    // Try to get email from LinkedIn (optional)
    let email = null;
    try {
      const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      if (emailResponse.ok) {
        const emailData = await emailResponse.json();
        email = emailData.elements?.[0]?.['handle~']?.emailAddress;
      }
    } catch (emailError) {
      console.log('Email not available from LinkedIn:', emailError.message);
    }

    // If no email available, create a placeholder email
    if (!email) {
      email = `linkedin_${profileData.id}@vibecoding.local`;
    }

    // Create or find user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      const firstName = profileData.firstName?.localized?.en_US || 'LinkedIn';
      const lastName = profileData.lastName?.localized?.en_US || 'User';
      const name = `${firstName} ${lastName}`;

      user = new User({
        name,
        email,
        password: '', // No password for OAuth users
        subscription: {
          type: 'free',
          isActive: false
        },
        linkedinId: profileData.id,
        profilePicture: profileData.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier
      });

      await user.save();
    } else {
      // Update existing user with LinkedIn info if not already set
      if (!user.linkedinId) {
        user.linkedinId = profileData.id;
        user.profilePicture = profileData.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier;
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error('LinkedIn auth error:', error);
    res.status(500).json({ error: error.message || 'LinkedIn authentication failed' });
  }
});

// Contact form
app.post('/api/contact', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().isLength({ min: 3 }).withMessage('Subject must be at least 3 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Server error submitting contact form' });
  }
});

// Analytics tracking
app.post('/api/analytics', async (req, res) => {
  try {
    const { event, category, label, value, userId, sessionId } = req.body;

    const analytics = new Analytics({
      event,
      category,
      label,
      value,
      userId,
      sessionId,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    await analytics.save();
    res.json({ message: 'Analytics event tracked' });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Server error tracking analytics' });
  }
});

// Subscription management
app.post('/api/subscription/create', auth, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ error: 'Payment service not available' });
    }

    const { plan } = req.body;
    const amount = plan === 'basic' ? 99900 : 199900; // ₹999 or ₹1999 in paise

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `sub_${req.user._id.toString().slice(-8)}_${Date.now().toString().slice(-8)}`,
      notes: {
        userId: req.user._id.toString(),
        plan: plan
      }
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: amount });
  } catch (error) {
    console.error('Subscription order creation error:', error);
    res.status(500).json({ error: 'Error creating subscription order' });
  }
});

app.post('/api/subscription/verify', auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!razorpay) {
      return res.status(500).json({ error: 'Payment service not available' });
    }

    // Verify payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update user subscription
    const plan = req.body.plan || 'basic';
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription

    await User.findByIdAndUpdate(req.user._id, {
      'subscription.type': plan,
      'subscription.startDate': startDate,
      'subscription.endDate': endDate,
      'subscription.isActive': true
    });

    res.json({ message: 'Subscription activated successfully' });
  } catch (error) {
    console.error('Subscription verification error:', error);
    res.status(500).json({ error: 'Error verifying subscription' });
  }
});

// Webinar registration
app.post('/api/webinar/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('experience').trim().notEmpty().withMessage('Experience level is required'),
  body('goals').trim().notEmpty().withMessage('Goals are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), error: 'Validation failed' });
    }

    if (!razorpay) {
      console.error('Webinar registration error: Razorpay not initialized');
      return res.status(500).json({ error: 'Payment service not available' });
    }

    const { name, email, phone, experience, goals } = req.body;
    const amount = 9900; // ₹99 in paise

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `web_${Date.now().toString().slice(-8)}`,
      notes: {
        name,
        email,
        phone,
        experience,
        goals
      }
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: amount });
  } catch (error) {
    console.error('Webinar registration error:', {
      message: error?.message,
      stack: error?.stack,
      response: error?.response?.data || null,
    });
    // Normalize Razorpay errors if present
    const errMsg = error?.error?.description || error?.message || 'Error creating webinar order';
    res.status(500).json({ error: errMsg });
  }
});

app.post('/api/webinar/verify', async (req, res) => {
  try {
    const { orderId, paymentId, signature, name, email, phone, experience, goals } = req.body;

    if (!razorpay) {
      console.error('Webinar verification error: Razorpay not initialized');
      return res.status(500).json({ error: 'Payment service not available' });
    }

    // Verify payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Save webinar registration
    const registration = new WebinarRegistration({
      name,
      email,
      phone,
      experience,
      goals,
      paymentId,
      orderId,
      amount: 9900,
      status: 'completed'
    });

    await registration.save();

    res.json({ message: 'Webinar registration successful' });
  } catch (error) {
    console.error('Webinar verification error:', {
      message: error?.message,
      stack: error?.stack,
      response: error?.response?.data || null,
    });
    const errMsg = error?.error?.description || error?.message || 'Error verifying webinar payment';
    res.status(500).json({ error: errMsg });
  }
});

// Course registration endpoints
app.post('/api/courses/register', auth, async (req, res) => {
  try {
    const { courseId, courseTitle } = req.body;
    
    // Check if user already registered for this course
    const existingRegistration = await User.findOne({
      _id: req.user._id,
      'courseRegistrations.courseId': courseId
    });
    
    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered for this course' });
    }
    
    // Add course registration to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        courseRegistrations: {
          courseId,
          courseTitle,
          registeredAt: new Date(),
          status: 'active',
          progress: 0
        }
      }
    });
    
    res.json({ message: 'Course registration successful' });
  } catch (error) {
    console.error('Course registration error:', error);
    res.status(500).json({ error: 'Error registering for course' });
  }
});

app.get('/api/courses/my-courses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('courseRegistrations');
    res.json({ courses: user.courseRegistrations || [] });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// Get Razorpay key
app.get('/api/razorpay-key', (req, res) => {
  res.json({ key: RAZORPAY_KEY_ID });
});

// Razorpay diagnostic - validate credentials/connectivity without exposing secrets
app.get('/api/razorpay-status', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(200).json({
        ok: false,
        initialized: false,
        canListOrders: false,
        message: 'Razorpay not initialized',
      });
    }

    // Attempt a minimal list orders call; if credentials are invalid, this will error
    const result = await razorpay.orders.all({ count: 1 });
    const first = Array.isArray(result?.items) && result.items.length > 0 ? result.items[0] : null;
    return res.json({
      ok: true,
      initialized: true,
      canListOrders: true,
      sampleOrder: first ? {
        id: first.id,
        amount: first.amount,
        currency: first.currency,
        status: first.status,
        created_at: first.created_at,
      } : null,
    });
  } catch (error) {
    const statusCode = error?.statusCode || error?.status || 200; // respond 200 to avoid noisy monitors
    const description = error?.error?.description || error?.message || 'Unknown error';
    return res.status(200).json({
      ok: false,
      initialized: !!razorpay,
      canListOrders: false,
      error: description,
      statusCode,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});