import axios from 'axios';

async function testGeminiDirectly() {
  console.log('Testing direct message to Gemini API...\n');
  
  const messages = [
    'What is 2+2?',
    'How does photosynthesis work?',
    'Tell me a joke',
    'What is the capital of France?'
  ];
  
  for (const msg of messages) {
    try {
      const response = await axios.post('http://localhost:5000/api/ask-ai', {
        message: msg,
        sessionId: 'test-' + Date.now() + Math.random()
      });
      
      const text = response.data.response.substring(0, 150);
      const isDemoKeyword = text.toLowerCase().includes('configure') || text.toLowerCase().includes('valid api');
      
      console.log(`Q: ${msg}`);
      console.log(`A: ${text}...`);
      console.log(`Mode: ${isDemoKeyword ? '⚠️ Demo' : '✅ Live API'}\n`);
      
      if (!isDemoKeyword) break;
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }
}

testGeminiDirectly();
