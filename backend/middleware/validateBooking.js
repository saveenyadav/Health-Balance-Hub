import Yoga from '../models/Yoga.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from './asyncHandler.js';

//* Middleware to validate booking requests and enforce booking rules
export const validateBooking = asyncHandler(async (req, res, next) => {
  const { classId, notes } = req.body;

  //* Validate required fields
  if (!classId) {
    return next(new ErrorResponse('Please provide a class ID to book', 400));
  }

  //* Find the yoga class
  const yogaClass = await Yoga.findById(classId);

  if (!yogaClass) {
    return next(new ErrorResponse(`Yoga class not found with id of ${classId}`, 404));
  }

  //* Check if class is in the future
  const now = new Date();
  const classDateTime = new Date(yogaClass.schedule.date);
  
  if (classDateTime <= now) {
    return next(new ErrorResponse('Cannot book classes that have already started or passed', 400));
  }

  //* Check if user is already enrolled in this class
  const existingBooking = yogaClass.enrolled.find(
    booking => booking.user.toString() === req.user.id
  );

  if (existingBooking) {
    if (existingBooking.status === 'confirmed') {
      return next(new ErrorResponse('You are already confirmed for this class', 400));
    } else if (existingBooking.status === 'waitlist') {
      return next(new ErrorResponse('You are already on the waitlist for this class', 400));
    }
  }

  //* Check booking window (can't book within 30 minutes of class start)
  const timeDiff = classDateTime.getTime() - now.getTime();
  const minutesDiff = timeDiff / (1000 * 60);

  if (minutesDiff < 30) {
    return next(new ErrorResponse('Cannot book classes starting within 30 minutes', 400));
  }

  //* Check if booking is too far in advance (optional - 30 days limit)
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  if (daysDiff > 30) {
    return next(new ErrorResponse('Cannot book classes more than 30 days in advance', 400));
  }

  //* Validate notes length if provided
  if (notes && notes.length > 500) {
    return next(new ErrorResponse('Booking notes cannot exceed 500 characters', 400));
  }

  //* All validations passed
  next();
});