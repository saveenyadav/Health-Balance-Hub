import express from 'express';
import {
  getUserBookings,
  bookYogaClass,
  cancelBooking,
  getBookingHistory,
  getClassBookings
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';
import { checkCapacity } from '../middleware/checkCapacity.js';        
import { validateBooking } from '../middleware/validateBooking.js';    

const router = express.Router();

//* All booking routes require authentication
router.use(protect);

//* User booking routes
router.get('/', getUserBookings);
router.get('/history', getBookingHistory);


router.post('/', 
  validateBooking,    //? Validate booking rules first
  checkCapacity,      //? Check class capacity second
  bookYogaClass       //? Create booking last
);

router.delete('/cancel/:classId', cancelBooking);

//* Admin/Instructor routes
router.get('/class/:classId', authorize('admin', 'instructor'), getClassBookings);

export default router;