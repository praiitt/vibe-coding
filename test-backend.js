const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Test utilities
const log = (message, data = null) => {
  console.log(`\n🔍 ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
};

const logSuccess = (message) => {
  console.log(`✅ ${message}`);
};

const logError = (message, error = null) => {
  console.log(`❌ ${message}`);
  if (error) console.log(`Error: ${error.message || error}`);
};

const logWarning = (message) => {
  console.log(`⚠️  ${message}`);
};

// Test functions
async function testHealthCheck() {
  log('Testing Health Check Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    logSuccess('Health check passed');
    log('Health check response:', response.data);
    return true;
  } catch (error) {
    logError('Health check failed', error);
    return false;
  }
}

async function testUserRegistration() {
  log('Testing User Registration');
  try {
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123'
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    authToken = response.data.token;
    logSuccess('User registration successful');
    log('Registration response:', {
      user: response.data.user,
      hasToken: !!response.data.token
    });
    return true;
  } catch (error) {
    logError('User registration failed', error);
    return false;
  }
}

async function testUserLogin() {
  log('Testing User Login');
  try {
    const loginData = {
      email: 'test@example.com',
      password: 'testpassword123'
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    authToken = response.data.token;
    logSuccess('User login successful');
    log('Login response:', {
      user: response.data.user,
      hasToken: !!response.data.token
    });
    return true;
  } catch (error) {
    logWarning('User login failed (expected if user doesn\'t exist)', error);
    return false;
  }
}

async function testGetCurrentUser() {
  log('Testing Get Current User');
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logSuccess('Get current user successful');
    log('Current user:', response.data.user);
    return true;
  } catch (error) {
    logError('Get current user failed', error);
    return false;
  }
}

async function testContactForm() {
  log('Testing Contact Form Submission');
  try {
    const contactData = {
      name: 'Test Contact',
      email: 'contact@example.com',
      message: 'This is a test message for the contact form.'
    };
    
    const response = await axios.post(`${BASE_URL}/api/contact`, contactData);
    logSuccess('Contact form submission successful');
    log('Contact response:', response.data);
    return true;
  } catch (error) {
    logError('Contact form submission failed', error);
    return false;
  }
}

async function testAnalytics() {
  log('Testing Analytics Tracking');
  try {
    const analyticsData = {
      event: 'test_event',
      category: 'test',
      label: 'backend_test',
      value: 1,
      userId: 'test_user',
      sessionId: 'test_session'
    };
    
    const response = await axios.post(`${BASE_URL}/api/analytics`, analyticsData);
    logSuccess('Analytics tracking successful');
    log('Analytics response:', response.data);
    return true;
  } catch (error) {
    logError('Analytics tracking failed', error);
    return false;
  }
}

async function testSubscriptionOrder() {
  log('Testing Subscription Order Creation');
  try {
    const response = await axios.post(`${BASE_URL}/api/subscription/create`, 
      { plan: 'basic' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logSuccess('Subscription order creation successful');
    log('Subscription order:', response.data);
    return true;
  } catch (error) {
    logError('Subscription order creation failed', error);
    return false;
  }
}

async function testWebinarRegistration() {
  log('Testing Webinar Registration');
  try {
    const webinarData = {
      name: 'Test User',
      email: 'webinar@example.com',
      phone: '9876543210',
      experience: 'Beginner',
      goals: 'Learn vibe coding'
    };
    
    const response = await axios.post(`${BASE_URL}/api/webinar/register`, webinarData);
    logSuccess('Webinar registration successful');
    log('Webinar order:', response.data);
    return true;
  } catch (error) {
    logError('Webinar registration failed', error);
    return false;
  }
}

async function testRazorpayKey() {
  log('Testing Razorpay Key Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/api/razorpay-key`);
    logSuccess('Razorpay key retrieval successful');
    log('Razorpay key response:', response.data);
    return true;
  } catch (error) {
    logError('Razorpay key retrieval failed', error);
    return false;
  }
}

async function testInvalidEndpoints() {
  log('Testing Invalid Endpoints (should return 404)');
  try {
    await axios.get(`${BASE_URL}/api/invalid-endpoint`);
    logError('Invalid endpoint should have returned 404');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logSuccess('Invalid endpoint correctly returned 404');
      return true;
    } else {
      logError('Invalid endpoint test failed', error);
      return false;
    }
  }
}

async function testUnauthorizedAccess() {
  log('Testing Unauthorized Access (should return 401)');
  try {
    await axios.get(`${BASE_URL}/api/auth/me`);
    logError('Unauthorized access should have returned 401');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logSuccess('Unauthorized access correctly returned 401');
      return true;
    } else {
      logError('Unauthorized access test failed', error);
      return false;
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Backend API Tests');
  console.log('=====================================');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Get Current User', fn: testGetCurrentUser },
    { name: 'Contact Form', fn: testContactForm },
    { name: 'Analytics Tracking', fn: testAnalytics },
    { name: 'Subscription Order', fn: testSubscriptionOrder },
    { name: 'Webinar Registration', fn: testWebinarRegistration },
    { name: 'Razorpay Key', fn: testRazorpayKey },
    { name: 'Invalid Endpoints', fn: testInvalidEndpoints },
    { name: 'Unauthorized Access', fn: testUnauthorizedAccess }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
    } catch (error) {
      logError(`Test ${test.name} threw an error`, error);
      results.push({ name: test.name, passed: false });
    }
  }
  
  // Generate test report
  console.log('\n📊 TEST REPORT');
  console.log('=====================================');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
  });
  
  console.log(`\n📈 SUMMARY: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    logSuccess('All tests passed! 🎉');
  } else {
    logWarning(`${total - passed} tests failed`);
  }
  
  return { passed, total, results };
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };
