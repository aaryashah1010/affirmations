import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);

// Protected routes
router.get('/profile', authenticateUser, AuthController.getProfile);
router.put('/profile', authenticateUser, AuthController.updateProfile);
router.post('/signout', authenticateUser, AuthController.signOut);

export default router;
