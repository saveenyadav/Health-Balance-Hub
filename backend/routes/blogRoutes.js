import express from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogs,
  getMyBlogs
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

//* Public routes - No authentication required
router.get('/', getBlogs);
router.get('/search', searchBlogs);
router.get('/:id', getBlog);

//* Protected routes - Authentication required
router.use(protect);

//* User routes (get own blogs)
router.get('/user/my-blogs', getMyBlogs);

//* Admin/Instructor only routes
router.post('/', authorize('admin', 'instructor'), createBlog);
router.put('/:id', authorize('admin', 'instructor'), updateBlog);
router.delete('/:id', authorize('admin', 'instructor'), deleteBlog);

export default router;