import express from 'express';
import { SessionController } from '../controllers/sessionController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// Session operations
router.post('/', SessionController.createSession);
router.get('/', SessionController.getUserSessions);
router.get('/stats', SessionController.getSessionStats);
router.put('/:id', SessionController.updateSession);

export default router;
