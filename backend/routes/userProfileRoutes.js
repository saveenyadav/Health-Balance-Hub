import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updateFitnessPreferences,
  getUserDashboard,
  getUserStats
} from '../controllers/userProfileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//* All profile routes require authentication
router.use(protect);

//* User profile management
router.get('/', getUserProfile);
router.put('/', updateUserProfile);
router.put('/preferences', updateFitnessPreferences);

//* User dashboard and statistics
router.get('/dashboard', getUserDashboard);
router.get('/stats', getUserStats);

export default router;