const axios = require('axios');

async function testRazorpayKey() {
  console.log('🔍 Testing Razorpay Key Fetch...');
  
  try {
    const response = await axios.get('http://localhost:5000/api/razorpay-key');
    console.log('✅ Razorpay key fetched successfully');
    console.log('   Key:', response.data.key);
    console.log('   Key length:', response.data.key.length);
    
    if (response.data.key && response.data.key.startsWith('rzp_')) {
      console.log('✅ Key format is correct (starts with rzp_)');
    } else {
      console.log('❌ Key format is incorrect');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to fetch Razorpay key:', error.message);
    return false;
  }
}

testRazorpayKey().then(success => {
  process.exit(success ? 0 : 1);
});
