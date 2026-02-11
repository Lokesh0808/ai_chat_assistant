import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key:', apiKey ? `✓ (${apiKey.length} chars)` : '✗ NOT SET');

const models = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-pro-latest', 'gemini-1.5-flash'];

for (const modelName of models) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    console.log(`\nTesting model: ${modelName}`);
    const response = await model.generateContent('Say hi');
    console.log(`✓ ${modelName} Works!`);
    console.log('Response:', response.response.text().substring(0, 50));
    break;
  } catch (error) {
    console.log(`✗ ${modelName} failed:`, error.message.split(':')[1]?.trim().substring(0, 40));
  }
}

