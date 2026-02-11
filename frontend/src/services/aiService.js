import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const aiService = {
  askAI: async (message, sessionId) => {
    try {
      const response = await axios.post(`${API_URL}/ask-ai`, {
        message,
        sessionId
      });
      return response.data.response;
    } catch (error) {
      console.error('Error asking AI:', error);
      throw error;
    }
  },

  clearSession: async (sessionId) => {
    try {
      await axios.post(`${API_URL}/clear-session`, {
        sessionId
      });
    } catch (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
  }
};
