import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyA3_kip1yujafJig3SpIzOpU-ZAjSBxFu8';

console.log('🧪 Testing Google Gemini API directly...\n');
console.log('API Key:', apiKey ? `✓ (${apiKey.length} chars)` : '✗ NOT SET\n');

const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

async function testModels() {
  for (const modelName of models) {
    try {
      console.log(`\n🔄 Testing model: ${modelName}`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const response = await model.generateContent('Say "Voice AI test successful" in one sentence');
      const text = response.response.text();
      
      console.log(`✅ ${modelName} Works!`);
      console.log(`Response: ${text.substring(0, 100)}`);
      console.log('\n✓ Gemini API is working correctly!');
      process.exit(0);
    } catch (error) {
      console.log(`⚠️ ${modelName} error:`, error.message.split('\n')[0]);
    }
  }
  
  console.log('\n❌ All models failed');
  process.exit(1);
}

testModels();
