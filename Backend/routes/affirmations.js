import express from 'express';
import { AffirmationController } from '../controllers/affirmationController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// Affirmation operations
router.get('/problem/:problemId', AffirmationController.getAffirmationsByProblem);
router.get('/favorites', AffirmationController.getFavoriteAffirmations);
router.put('/:id/favorite', AffirmationController.toggleFavorite);
router.post('/problem/:problemId/generate', AffirmationController.generateNewAffirmation);

export default router;
