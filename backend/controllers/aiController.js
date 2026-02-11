import { getAIResponse, conversationManager, getAPIStatus as getServiceStatus } from '../services/aiService.js';
import { sanitizeInput, isValidInput } from '../middleware/inputValidator.js';

export const askAI = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        error: 'Message and sessionId are required'
      });
    }

    if (!isValidInput(message)) {
      return res.status(400).json({
        error: 'Invalid input: message must be non-empty and under 1000 characters'
      });
    }

    const sanitizedMessage = sanitizeInput(message);
    const response = await getAIResponse(sanitizedMessage, sessionId);

    res.json({
      success: true,
      response,
      sessionId
    });
  } catch (error) {
    next(error);
  }
};

export const clearSession = (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: 'sessionId is required'
      });
    }

    conversationManager.clearSession(sessionId);
    res.json({ success: true, message: 'Session cleared' });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to clear session'
    });
  }
};

export const getAPIStatus = (req, res) => {
  try {
    const status = getServiceStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get API status'
    });
  }
};
