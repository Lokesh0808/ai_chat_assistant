import express from 'express';
import { askAI, clearSession } from '../controllers/aiController.js';
import { strictRateLimiter } from '../middleware/rateLimiter.js';
import { getAPIStatus } from '../controllers/aiController.js';

const router = express.Router();

router.post('/ask-ai', strictRateLimiter, askAI);
router.post('/clear-session', clearSession);
router.get('/status', getAPIStatus);

export default router;
