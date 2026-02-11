import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';

export const useConversation = (sessionId) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    try {
      setError(null);
      setIsLoading(true);

      // Add user message to history
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: Date.now()
      };
      setHistory(prev => [...prev, userMessage]);

      // Get AI response
      const response = await aiService.askAI(message, sessionId);

      // Add AI response to history
      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      setHistory(prev => [...prev, assistantMessage]);

      return response;
    } catch (err) {
      setError(err.message || 'Failed to get response');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    aiService.clearSession(sessionId);
  }, [sessionId]);

  return {
    history,
    isLoading,
    error,
    sendMessage,
    clearHistory
  };
};
