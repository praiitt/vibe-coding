const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Generate unique test data
const timestamp = Date.now();
const testUserData = {
  name: `Test User ${timestamp}`,
  email: `test${timestamp}@example.com`,
  password: 'testpassword123'
};

const testContactData = {
  name: `Test User ${timestamp}`,
  email: `test${timestamp}@example.com`,
  subject: 'Test Subject',
  message: 'This is a comprehensive test message with more than 10 characters to meet validation requirements.'
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
  console.log('🚀 Starting Fresh Backend Tests...\n');
  
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

  // Webinar Order Creation
  total++;
  if (await testEndpoint('Webinar Order Creation', async () => {
    const response = await axios.post(`${BASE_URL}/api/webinar/register`, {
      name: testUserData.name,
      email: testUserData.email,
      phone: '+919876543210',
      experience: 'beginner',
      goals: 'Learn programming'
    });
    return response.data;
  })) passed++;

  // Analytics Tracking
  total++;
  if (await testEndpoint('Analytics Tracking', async () => {
    const response = await axios.post(`${BASE_URL}/api/analytics`, {
      event: 'test_event',
      category: 'test_category',
      label: 'test_label',
      value: 1
    });
    return response.data;
  })) passed++;

  // Razorpay Key
  total++;
  if (await testEndpoint('Razorpay Key', async () => {
    const response = await axios.get(`${BASE_URL}/api/razorpay-key`);
    return response.data;
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
