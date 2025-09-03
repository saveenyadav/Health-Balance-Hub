import express from 'express';
import {
  submitContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats,
  searchContacts
  // REMOVED: testDatabaseRead (no longer needed)
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

//* Public route - No authentication required (matches frontend)
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
router.delete('/:id', deleteContact);

export default router;