import express from 'express';
import { RetellController } from '../controllers/retellController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// Generate conversation token
router.post('/generate-token', RetellController.generateConversationToken);

export default router;
