import express from 'express';
import { ProblemController } from '../controllers/problemController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// Problem categories (public read)
router.get('/categories', ProblemController.getProblemCategories);

// Problem CRUD operations
router.post('/', ProblemController.createProblem);
router.get('/', ProblemController.getUserProblems);
router.get('/:id', ProblemController.getProblemById);
router.put('/:id', ProblemController.updateProblem);
router.delete('/:id', ProblemController.deleteProblem);

export default router;
