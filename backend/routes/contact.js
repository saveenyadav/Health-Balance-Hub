import express from 'express';
import {
  submitContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats,
  searchContacts
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

//* public route - no authentication required (frontend)
router.post('/', submitContact);

//* protected routes - Admin only (simplified admin panel)
router.use(protect);
router.use(authorize('admin'));

//*  admin contact management routes
router.get('/', getAllContacts);
router.get('/search', searchContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContact);
router.put('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

export default router;