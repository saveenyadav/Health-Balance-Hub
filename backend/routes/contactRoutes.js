import express from 'express';
import {
  submitContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  respondToContact,
  deleteContact,
  getContactStats,
  searchContacts
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

//* Public route - No authentication required
router.post('/', submitContact);

//* Protected routes - Admin only
router.use(protect);
router.use(authorize('admin'));

//* Admin contact management routes
router.get('/', getAllContacts);
router.get('/search', searchContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContact);
router.put('/:id/status', updateContactStatus);
router.put('/:id/respond', respondToContact);
router.delete('/:id', deleteContact);

export default router;