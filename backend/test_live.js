import axios from 'axios';

async function testAPI() {
  console.log('🧪 Testing Voice AI Backend...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('   ✓ Backend running:', health.data.status);
    
    // Test 2: API request
    console.log('\n2️⃣ Testing AI endpoint...');
    const aiResponse = await axios.post('http://localhost:5000/api/ask-ai', {
      message: 'Testing voice AI. Can you confirm the API is working?',
      sessionId: 'test-' + Date.now()
    });
    
    console.log('   ✓ Response received');
    console.log('\n📝 Response:');
    console.log(aiResponse.data.response);
    
    // Check if using real API or demo
    const isDemoResponse = aiResponse.data.response.includes('configure') || aiResponse.data.response.includes('API key') || aiResponse.data.response.includes('demo');
    
    console.log('\n' + (isDemoResponse ? '⚠️' : '✅') + ' Mode:', isDemoResponse ? 'Demo (API key not working)' : 'Gemini API (working!)');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testAPI();
