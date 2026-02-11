import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Log the API URL being used (for debugging)
console.log('[API Config]', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_URL: API_URL,
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV
});

export const aiService = {
  askAI: async (message, sessionId) => {
    try {
      const endpoint = `${API_URL}/ask-ai`;
      console.log('[API Request]', { endpoint, message: message.substring(0, 50) });
      
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
        throw new Error(`Network Error: Cannot connect to API at ${API_URL}`);
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found - backend may not be running');
      } else if (error.response?.status === 504) {
        throw new Error('Bad Gateway - backend service is unavailable');
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
      const endpoint = `${API_URL.replace('/ask-ai', '').replace('/clear-session', '')}/health`;
      console.log('[Health Check]', { endpoint });
      
      const response = await axios.get(endpoint, { timeout: 5000 });
      console.log('[Health Check Response]', response.data);
      return response.data;
    } catch (error) {
      console.error('[Health Check Failed]', error.message);
      return { status: 'error', message: error.message };
    }
  }
};

