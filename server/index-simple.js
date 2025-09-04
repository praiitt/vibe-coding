const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage for testing (replace with MongoDB later)
const users = new Map();
const contacts = [];
const analytics = [];
const webinarRegistrations = [];

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Razorpay
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay initialized successfully');
} else {
  console.log('⚠️  Razorpay not initialized - missing credentials');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Vibe Coding Server is running!',
    timestamp: new Date().toISOString(),
    razorpay: razorpay ? 'Configured' : 'Not configured',
    mongodb: 'Using in-memory storage for testing'
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
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      subscription: {
        type: 'free',
        isActive: false
      },
      createdAt: new Date()
    };

    users.set(email, user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
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
    const user = users.get(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
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

// Middleware to verify JWT token
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = Array.from(users.values()).find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Get current user
app.get('/api/auth/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      subscription: req.user.subscription
    }
  });
});

// Contact form
app.post('/api/contact', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    const contact = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date()
    };

    contacts.push(contact);

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

    const analyticsEntry = {
      id: Date.now().toString(),
      event,
      category,
      label,
      value,
      userId,
      sessionId,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date()
    };

    analytics.push(analyticsEntry);
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
      receipt: `sub_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id,
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

    req.user.subscription = {
      type: plan,
      startDate: startDate,
      endDate: endDate,
      isActive: true
    };

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
      return res.status(400).json({ errors: errors.array() });
    }

    if (!razorpay) {
      return res.status(500).json({ error: 'Payment service not available' });
    }

    const { name, email, phone, experience, goals } = req.body;
    const amount = 9900; // ₹99 in paise

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `webinar_${Date.now()}`,
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
    console.error('Webinar registration error:', error);
    res.status(500).json({ error: 'Error creating webinar order' });
  }
});

app.post('/api/webinar/verify', async (req, res) => {
  try {
    const { orderId, paymentId, signature, name, email, phone, experience, goals } = req.body;

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

    // Save webinar registration
    const registration = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      experience,
      goals,
      paymentId,
      orderId,
      amount: 9900,
      status: 'completed',
      createdAt: new Date()
    };

    webinarRegistrations.push(registration);

    res.json({ message: 'Webinar registration successful' });
  } catch (error) {
    console.error('Webinar verification error:', error);
    res.status(500).json({ error: 'Error verifying webinar payment' });
  }
});

// Get Razorpay key
app.get('/api/razorpay-key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || '' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💾 Using in-memory storage for testing`);
});
