import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyA3_kip1yujafJig3SpIzOpU-ZAjSBxFu8';

console.log('🧪 Checking available Gemini models...\n');

try {
  const genAI = new GoogleGenerativeAI(apiKey);
  console.log('✅ GoogleGenerativeAI initialized');
  
  // Try the most reliable model
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
  console.log('✅ Model object created\n');
  
  console.log('⏳ Sending test message to Gemini...\n');
  const response = await model.generateContent('Hello, this is a test. Please respond with a short greeting.');
  
  const text = response.response.text();
  console.log('✅ Gemini API Response:');
  console.log(text);
  console.log('\n✓ Gemini API is working correctly!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('\nPossible issues:');
  console.error('1. API key is invalid or has been revoked');
  console.error('2. Model name is incorrect');
  console.error('3. Network/connectivity issue');
  console.error('4. API quota exceeded');
}
