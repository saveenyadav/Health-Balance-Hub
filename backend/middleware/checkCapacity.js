import Yoga from '../models/Yoga.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from './asyncHandler.js';

//* Middleware to check yoga class capacity before booking
export const checkCapacity = asyncHandler(async (req, res, next) => {
  const { classId } = req.body;

  //* Find the yoga class
  const yogaClass = await Yoga.findById(classId);

  if (!yogaClass) {
    return next(new ErrorResponse(`Yoga class not found with id of ${classId}`, 404));
  }

  //* Check if class is active
  if (!yogaClass.isActive) {
    return next(new ErrorResponse('This yoga class is no longer active', 400));
  }

  //* Check if class is full (confirmed bookings only)
  const confirmedBookings = yogaClass.enrolled.filter(booking => booking.status === 'confirmed');
  
  if (confirmedBookings.length >= yogaClass.capacity) {
    //* Class is full - will be added to waitlist
    req.isWaitlist = true;
  } else {
    //* Class has available spots
    req.isWaitlist = false;
  }

  //* Attach class to request for use in controller
  req.yogaClass = yogaClass;

  next();
});