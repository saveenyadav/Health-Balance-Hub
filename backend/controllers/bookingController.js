import Yoga from '../models/Yoga.js';
import UserProfile from '../models/UserProfile.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

//* Get user's current bookings - Private
export const getUserBookings = asyncHandler(async (req, res, next) => {
  //* Find all yoga classes where user is enrolled
  const yogaClasses = await Yoga.find({
    'enrolled.user': req.user.id,
    'enrolled.status': { $in: ['confirmed', 'waitlist'] }
  })
  .populate('instructor', 'name email')
  .sort({ 'schedule.startTime': 1 });

  //* Extract user's booking details from each class
  const userBookings = yogaClasses.map(yogaClass => {
    const userBooking = yogaClass.enrolled.find(
      booking => booking.user.toString() === req.user.id
    );
    
    return {
      _id: userBooking._id,
      yogaClass: {
        _id: yogaClass._id,
        title: yogaClass.title,
        type: yogaClass.type,
        level: yogaClass.level,
        duration: yogaClass.duration,
        instructor: yogaClass.instructor,
        schedule: yogaClass.schedule,
        location: yogaClass.location
      },
      status: userBooking.status,
      bookingDate: userBooking.bookingDate,
      notes: userBooking.notes
    };
  });

  res.status(200).json({
    success: true,
    count: userBookings.length,
    data: userBookings
  });
});

//* Book a yoga class - Private
export const bookYogaClass = asyncHandler(async (req, res, next) => {
  const { classId, notes } = req.body;

  //* Find the yoga class
  const yogaClass = await Yoga.findById(classId);
  
  if (!yogaClass) {
    return next(new ErrorResponse(`Yoga class not found with id of ${classId}`, 404));
  }

  //* Check if class is active
  if (!yogaClass.isActive) {
    return next(new ErrorResponse('This yoga class is no longer active', 400));
  }

  //* Check if user is already enrolled
  const existingBooking = yogaClass.enrolled.find(
    booking => booking.user.toString() === req.user.id
  );

  if (existingBooking) {
    return next(new ErrorResponse('You are already enrolled in this class', 400));
  }

  //* Check if class is full and determine status
  let bookingStatus = 'confirmed';
  if (yogaClass.isFull()) {
    bookingStatus = 'waitlist';
  }

  //* Add user to enrolled array
  yogaClass.enrolled.push({
    user: req.user.id,
    status: bookingStatus,
    bookingDate: new Date(),
    notes: notes || ''
  });

  //* Save the yoga class
  await yogaClass.save();

  //* Update user's booking stats
  await updateUserBookingStats(req.user.id, 'book');

  //* Populate and return the updated class
  await yogaClass.populate([
    { path: 'instructor', select: 'name email' },
    { path: 'enrolled.user', select: 'name email' }
  ]);

  res.status(201).json({
    success: true,
    data: yogaClass,
    message: bookingStatus === 'confirmed' 
      ? 'Successfully booked yoga class!' 
      : 'Added to waitlist - you will be notified if a spot opens up'
  });
});

//* Cancel a booking - Private
export const cancelBooking = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;

  //* Find the yoga class
  const yogaClass = await Yoga.findById(classId);
  
  if (!yogaClass) {
    return next(new ErrorResponse(`Yoga class not found with id of ${classId}`, 404));
  }

  //* Find user's booking
  const bookingIndex = yogaClass.enrolled.findIndex(
    booking => booking.user.toString() === req.user.id
  );

  if (bookingIndex === -1) {
    return next(new ErrorResponse('You are not enrolled in this class', 400));
  }

  //* Check cancellation policy (can't cancel within 2 hours of class)
  const classDateTime = new Date(yogaClass.schedule.date);
  const now = new Date();
  const timeDiff = classDateTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);

  if (hoursDiff < 2 && hoursDiff > 0) {
    return next(new ErrorResponse('Cannot cancel within 2 hours of class start time', 400));
  }

  //* Remove booking from enrolled array
  yogaClass.enrolled.splice(bookingIndex, 1);

  //* Promote someone from waitlist if there was a confirmed booking
  const waitlistBooking = yogaClass.enrolled.find(booking => booking.status === 'waitlist');
  if (waitlistBooking && yogaClass.enrolled.filter(b => b.status === 'confirmed').length < yogaClass.capacity) {
    waitlistBooking.status = 'confirmed';
  }

  //* Save the yoga class
  await yogaClass.save();

  //* Update user's booking stats
  await updateUserBookingStats(req.user.id, 'cancel');

  res.status(200).json({
    success: true,
    data: {},
    message: 'Booking cancelled successfully'
  });
});

//* Get booking history - Private
export const getBookingHistory = asyncHandler(async (req, res, next) => {
  //* Find all yoga classes where user was enrolled (including cancelled)
  const yogaClasses = await Yoga.find({
    'enrolled.user': req.user.id
  })
  .populate('instructor', 'name email')
  .sort({ 'schedule.date': -1 });

  //* Extract user's booking history
  const bookingHistory = yogaClasses.map(yogaClass => {
    const userBooking = yogaClass.enrolled.find(
      booking => booking.user.toString() === req.user.id
    );
    
    return {
      _id: userBooking._id,
      yogaClass: {
        _id: yogaClass._id,
        title: yogaClass.title,
        type: yogaClass.type,
        level: yogaClass.level,
        instructor: yogaClass.instructor,
        schedule: yogaClass.schedule
      },
      status: userBooking.status,
      bookingDate: userBooking.bookingDate,
      notes: userBooking.notes
    };
  });

  res.status(200).json({
    success: true,
    count: bookingHistory.length,
    data: bookingHistory
  });
});

//* Get class bookings (Admin/Instructor only) - Private
export const getClassBookings = asyncHandler(async (req, res, next) => {
  const { classId } = req.params;

  //* Find the yoga class
  const yogaClass = await Yoga.findById(classId)
    .populate('enrolled.user', 'name email')
    .populate('instructor', 'name email');
  
  if (!yogaClass) {
    return next(new ErrorResponse(`Yoga class not found with id of ${classId}`, 404));
  }

  //* Check if user is authorized (admin or class instructor)
  if (req.user.role !== 'admin' && yogaClass.instructor._id.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to view class bookings', 403));
  }

  //* Separate confirmed and waitlist bookings
  const confirmedBookings = yogaClass.enrolled.filter(booking => booking.status === 'confirmed');
  const waitlistBookings = yogaClass.enrolled.filter(booking => booking.status === 'waitlist');

  res.status(200).json({
    success: true,
    data: {
      class: {
        _id: yogaClass._id,
        title: yogaClass.title,
        capacity: yogaClass.capacity,
        availableSpots: yogaClass.availableSpots
      },
      confirmed: confirmedBookings,
      waitlist: waitlistBookings,
      stats: {
        totalConfirmed: confirmedBookings.length,
        totalWaitlist: waitlistBookings.length,
        availableSpots: yogaClass.availableSpots
      }
    }
  });
});

//* Helper function to update user booking stats
const updateUserBookingStats = async (userId, action) => {
  try {
    let userProfile = await UserProfile.findOne({ user: userId });
    
    if (!userProfile) {
      //* Create user profile if it doesn't exist
      userProfile = await UserProfile.create({ user: userId });
    }

    if (action === 'book') {
      userProfile.bookingStats.totalClasses += 1;
      userProfile.bookingStats.classesThisMonth += 1;
      userProfile.bookingStats.lastClassDate = new Date();
    } else if (action === 'cancel') {
      //* Don't decrease totals for cancellations, just track the action
    }

    await userProfile.save();
  } catch (error) {
    console.log('Error updating user booking stats:', error);
  }
};