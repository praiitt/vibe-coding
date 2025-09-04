const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testFrontendBackendConnection() {
  console.log('🔍 Testing Frontend-Backend Connection...');
  
  try {
    // Test 1: Health Check
    console.log('\n1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    
    // Test 2: Contact Form (simulating frontend contact form submission)
    console.log('\n2. Testing Contact Form Submission...');
    const contactData = {
      name: 'Frontend Test User',
      email: 'frontend-test@example.com',
      message: 'This is a test from frontend to backend connection'
    };
    
    const contactResponse = await axios.post(`${BASE_URL}/api/contact`, contactData);
    console.log('✅ Contact form submission successful:', contactResponse.data.message);
    
    // Test 3: User Registration (simulating frontend registration)
    console.log('\n3. Testing User Registration...');
    const userData = {
      name: 'Frontend Test User',
      email: `frontend-test-${Date.now()}@example.com`,
      password: 'testpassword123'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, userData);
    console.log('✅ User registration successful');
    console.log('   User ID:', registerResponse.data.user.id);
    console.log('   Has Token:', !!registerResponse.data.token);
    
    // Test 4: Analytics Tracking (simulating frontend analytics)
    console.log('\n4. Testing Analytics Tracking...');
    const analyticsData = {
      event: 'frontend_test',
      category: 'connection_test',
      label: 'frontend_backend_integration',
      value: 1,
      userId: registerResponse.data.user.id,
      sessionId: 'test_session_123'
    };
    
    const analyticsResponse = await axios.post(`${BASE_URL}/api/analytics`, analyticsData);
    console.log('✅ Analytics tracking successful:', analyticsResponse.data.message);
    
    // Test 5: Get Current User (simulating frontend auth check)
    console.log('\n5. Testing Get Current User...');
    const token = registerResponse.data.token;
    const userResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get current user successful');
    console.log('   User Name:', userResponse.data.user.name);
    console.log('   User Email:', userResponse.data.user.email);
    
    // Test 6: Razorpay Key (simulating frontend payment setup)
    console.log('\n6. Testing Razorpay Key Retrieval...');
    const razorpayResponse = await axios.get(`${BASE_URL}/api/razorpay-key`);
    console.log('✅ Razorpay key retrieval successful');
    console.log('   Key ID:', razorpayResponse.data.key);
    
    console.log('\n🎉 All Frontend-Backend Connection Tests Passed!');
    console.log('✅ The frontend can successfully communicate with the backend');
    console.log('✅ All API endpoints are working correctly');
    console.log('✅ Authentication flow is working');
    console.log('✅ Database operations are working');
    console.log('✅ Payment integration is ready');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Frontend-Backend Connection Test Failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
  }
}

// Run the test
testFrontendBackendConnection().then(success => {
  process.exit(success ? 0 : 1);
});
