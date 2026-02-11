import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
const envResult = dotenv.config({ path: envPath });

console.log('\n🔐 Loading environment');
console.log('  .env loaded:', envResult.error ? `✗ ${envResult.error.message}` : '✓');
console.log('  OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? `✓ (${process.env.OPENROUTER_API_KEY.length} chars)` : '✗ MISSING\n');

let apiAvailable = false;
let apiError = null;
const activeModel = 'gpt-3.5-turbo';

console.log('📡 Initializing OpenRouter API...');

if (process.env.OPENROUTER_API_KEY) {
  apiAvailable = true;
  console.log(`  ✅ OpenRouter ready (model: ${activeModel})\n`);
} else {
  apiError = 'OPENROUTER_API_KEY not configured';
  console.log(`  ❌ ${apiError}\n`);
}

class ConversationManager {
  constructor() {
    this.sessions = new Map();
  }

  getSession(sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        history: [],
        createdAt: Date.now(),
        responseCount: 0
      });
    }
    return this.sessions.get(sessionId);
  }

  addToHistory(sessionId, role, content) {
    const session = this.getSession(sessionId);
    session.history.push({ role, content });
  }

  getHistory(sessionId) {
    return this.getSession(sessionId).history;
  }

  clearSession(sessionId) {
    this.sessions.delete(sessionId);
  }
}

const conversationManager = new ConversationManager();

export { conversationManager };

export const getAIResponse = async (userMessage, sessionId) => {
  try {
    const session = conversationManager.getSession(sessionId);
    conversationManager.addToHistory(sessionId, 'user', userMessage);

    console.log(`\n📤 Message: "${userMessage.substring(0, 50)}..."`);

    if (!apiAvailable) {
      console.log('   ⚠️  API not available');
      const demoResponse = `Demo: Message received. Configure OPENROUTER_API_KEY to get real AI responses.`;
      conversationManager.addToHistory(sessionId, 'assistant', demoResponse);
      return demoResponse;
    }

    try {
      console.log(`   🔄 Calling OpenRouter (${activeModel})...`);
      
      let messages = session.history.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      messages.push({ role: 'user', content: userMessage });

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Voice AI Assistant'
        },
        body: JSON.stringify({
          model: activeModel,
          messages: messages,
          temperature: 0.9,
          max_tokens: 1024
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      const aiResponse = data.choices[0].message.content;
      console.log(`   ✅ Response: ${aiResponse.substring(0, 50)}...`);
      
      conversationManager.addToHistory(sessionId, 'assistant', aiResponse);
      return aiResponse;

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      apiError = error.message;
      
      const errorResponse = `I apologize, but I encountered an error: ${error.message}. Please try again.`;
      conversationManager.addToHistory(sessionId, 'assistant', errorResponse);
      return errorResponse;
    }

  } catch (error) {
    console.error('Fatal error in getAIResponse:', error);
    throw error;
  }
};

export const getAPIStatus = () => {
  return {
    status: apiAvailable ? 'connected' : 'disconnected',
    provider: 'OpenRouter',
    model: activeModel,
    available: apiAvailable,
    error: apiError,
    message: apiAvailable 
      ? '✅ OpenRouter API is operational' 
      : '❌ OpenRouter API not configured. Add OPENROUTER_API_KEY to backend/.env'
  };
};

export const clearSession = (sessionId) => {
  conversationManager.clearSession(sessionId);
};
