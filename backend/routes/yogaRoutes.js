import express from 'express';
import {
  getYogaClasses,
  getYogaClass,
  createYogaClass,
  updateYogaClass,
  deleteYogaClass,
  searchYogaClasses
} from '../controllers/yogaController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

//* Public routes - No authentication required
router.get('/', getYogaClasses);
router.get('/search', searchYogaClasses);
router.get('/:id', getYogaClass);

//* Protected routes - Authentication required
router.use(protect); //* All routes below require authentication

router.post('/', authorize('admin', 'instructor'), createYogaClass);
router.put('/:id', authorize('admin', 'instructor'), updateYogaClass);
router.delete('/:id', authorize('admin', 'instructor'), deleteYogaClass);

export default router;