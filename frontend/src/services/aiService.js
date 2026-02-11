import axios from 'axios';

// Get backend URL from environment or use relative path in dev
const getBackendURL = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  
  if (!baseUrl) {
    // Development: use relative /api for Vite proxy
    console.log('[API Config] No VITE_API_URL set - using local development proxy');
    return '/api';
  }
  
  // Production: ensure URL is well-formed
  let url = baseUrl.trim();
  
  // Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  
  // Ensure protocol is included
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  
  // Safety check: make sure it's not pointing to frontend
  if (url.includes('vfan') && url.includes('onrender')) {
    console.warn('[API Config] WARNING: API_URL points to frontend domain! Check VITE_API_URL environment variable');
    console.warn('[API Config] If you see this, your backend service might not be deployed. See RENDER_SETUP.md');
  }
  
  return url;
};

const API_URL = getBackendURL();

// Log the API URL being used (for debugging)
console.log('[API Config]', {
  VITE_API_URL: import.meta.env.VITE_API_URL || '(not set)',
  API_URL: API_URL,
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  timestamp: new Date().toISOString()
});

export const aiService = {
  askAI: async (message, sessionId) => {
    try {
      const endpoint = `${API_URL}/ask-ai`;
      console.log('[API Request]', { endpoint, message: message.substring(0, 50), timestamp: new Date().toISOString() });
      
      const response = await axios.post(endpoint, {
        message,
        sessionId
      }, {
        timeout: 30000 // 30 second timeout
      });
      
      console.log('[API Response]', { status: response.status, dataLength: response.data.response?.length });
      return response.data.response;
    } catch (error) {
      const errorMsg = {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data
      };
      console.error('[API Error]', errorMsg);
      
      // Provide user-friendly error message
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - backend is not responding');
      } else if (error.message === 'Network Error' || !error.response) {
        throw new Error(`Cannot connect to backend at ${API_URL}\n\nCheck RENDER_SETUP.md`);
      } else if (error.response?.status === 404) {
        throw new Error(`Endpoint not found\n\nIf you just deployed, wait 30 seconds for cold start.\nIf error persists, backend service may not be running.\n\nCheck RENDER_SETUP.md`);
      } else if (error.response?.status === 504) {
        throw new Error('Backend service unavailable - may be starting up');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden - CORS issue');
      }
      
      throw error;
    }
  },

  clearSession: async (sessionId) => {
    try {
      const endpoint = `${API_URL}/clear-session`;
      console.log('[API Request]', { endpoint: endpoint });
      
      await axios.post(endpoint, {
        sessionId
      }, {
        timeout: 10000
      });
    } catch (error) {
      console.error('[API Error]', error.message);
      throw error;
    }
  },

  // Debug endpoint to check API connectivity
  checkHealth: async () => {
    try {
      const healthUrl = `${API_URL}/health`;
      console.log('[Health Check] Pinging:', healthUrl);
      
      const response = await axios.get(healthUrl, { timeout: 5000 });
      console.log('[Health Check Response]', response.data);
      return response.data;
    } catch (error) {
      console.error('[Health Check Failed]', error.message);
      return { status: 'error', message: error.message };
    }
  }
};

