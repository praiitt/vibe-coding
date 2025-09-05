const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data
const testContactData = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'This is a comprehensive test message with more than 10 characters to meet validation requirements.'
};

const testUserData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpassword123'
};

const testAnalyticsData = {
  event: 'test_event',
  category: 'test_category',
  label: 'test_label',
  value: 1
};

async function testEndpoint(name, testFn) {
  console.log(`\n🧪 Testing ${name}...`);
  try {
    const result = await testFn();
    console.log(`✅ ${name}: PASSED`);
    if (result) {
      console.log(`   Response:`, JSON.stringify(result, null, 2));
    }
    return true;
  } catch (error) {
    console.log(`❌ ${name}: FAILED`);
    console.log(`   Error:`, error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Comprehensive Backend Tests...\n');
  
  let passed = 0;
  let total = 0;

  // Health Check
  total++;
  if (await testEndpoint('Health Check', async () => {
    const response = await axios.get(`${BASE_URL}/health`);
    return response.data;
  })) passed++;

  // Contact Form - Valid Data
  total++;
  if (await testEndpoint('Contact Form - Valid Data', async () => {
    const response = await axios.post(`${BASE_URL}/api/contact`, testContactData);
    return response.data;
  })) passed++;

  // Contact Form - Invalid Data (should return 400)
  total++;
  if (await testEndpoint('Contact Form - Invalid Data (400 expected)', async () => {
    try {
      await axios.post(`${BASE_URL}/api/contact`, {
        name: 'T', // Too short
        email: 'invalid-email', // Invalid email
        subject: '', // Empty
        message: 'short' // Too short
      });
      throw new Error('Expected 400 error but got success');
    } catch (error) {
      if (error.response?.status === 400) {
        return error.response.data;
      }
      throw error;
    }
  })) passed++;

  // User Registration
  total++;
  if (await testEndpoint('User Registration', async () => {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, testUserData);
    return response.data;
  })) passed++;

  // User Login
  total++;
  let authToken = null;
  if (await testEndpoint('User Login', async () => {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUserData.email,
      password: testUserData.password
    });
    authToken = response.data.token;
    return response.data;
  })) passed++;

  // Get Current User (with auth)
  total++;
  if (await testEndpoint('Get Current User (Authenticated)', async () => {
    const response = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    return response.data;
  })) passed++;

  // Analytics Tracking
  total++;
  if (await testEndpoint('Analytics Tracking', async () => {
    const response = await axios.post(`${BASE_URL}/api/analytics`, testAnalyticsData);
    return response.data;
  })) passed++;

  // Razorpay Key
  total++;
  if (await testEndpoint('Razorpay Key', async () => {
    const response = await axios.get(`${BASE_URL}/api/razorpay-key`);
    return response.data;
  })) passed++;

  // Webinar Order Creation
  total++;
  if (await testEndpoint('Webinar Order Creation', async () => {
    const response = await axios.post(`${BASE_URL}/api/webinar/register`, {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+919876543210',
      experience: 'beginner',
      goals: 'Learn programming'
    });
    return response.data;
  })) passed++;

  // Course Registration
  total++;
  if (await testEndpoint('Course Registration', async () => {
    const response = await axios.post(`${BASE_URL}/api/courses/register`, {
      courseId: 'web-development-basics',
      courseTitle: 'Web Development Basics'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    return response.data;
  })) passed++;

  // Get My Courses
  total++;
  if (await testEndpoint('Get My Courses', async () => {
    const response = await axios.get(`${BASE_URL}/api/courses/my-courses`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    return response.data;
  })) passed++;

  // Test Invalid Endpoint (should return 404)
  total++;
  if (await testEndpoint('Invalid Endpoint (404 expected)', async () => {
    try {
      await axios.get(`${BASE_URL}/api/invalid-endpoint`);
      throw new Error('Expected 404 error but got success');
    } catch (error) {
      if (error.response?.status === 404) {
        return { message: '404 Not Found (as expected)' };
      }
      throw error;
    }
  })) passed++;

  // Test Unauthorized Access
  total++;
  if (await testEndpoint('Unauthorized Access (401 expected)', async () => {
    try {
      await axios.get(`${BASE_URL}/api/auth/me`);
      throw new Error('Expected 401 error but got success');
    } catch (error) {
      if (error.response?.status === 401) {
        return { message: '401 Unauthorized (as expected)' };
      }
      throw error;
    }
  })) passed++;

  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (passed === total) {
    console.log('\n🎉 All tests passed! Backend is working perfectly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
}

// Run the tests
runTests().catch(console.error);
