const mongoose = require('mongoose');

async function testMongoDBConnection() {
  console.log('🔍 Testing MongoDB Connection...');
  
  const connectionString = 'mongodb+srv://vibecoding:vibecoding@vbcluster0.1c8ero3.mongodb.net/vibe-coding';
  
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Test a simple operation
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ name: 'Test Document' });
    await testDoc.save();
    console.log('✅ Test document saved successfully');
    
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document deleted successfully');
    
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully');
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

testMongoDBConnection().then(success => {
  process.exit(success ? 0 : 1);
});
