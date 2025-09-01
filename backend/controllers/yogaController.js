import Yoga from '../models/Yoga.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

//* Get all yoga classes - Public
export const getYogaClasses = asyncHandler(async (req, res, next) => {
  //* Build query object for filtering
  let query = { isActive: true };

  //* Add filters if provided
  if (req.query.type) query.type = req.query.type;
  if (req.query.level) query.level = req.query.level;
  if (req.query.instructor) query.instructor = req.query.instructor;
  if (req.query.location) query.location = req.query.location;

  //* Execute query with population
  const yogaClasses = await Yoga.find(query)
    .populate('instructor', 'name email')
    .sort({ 'schedule.startTime': 1 });

  //* Filter by available spots if requested
  let filteredClasses = yogaClasses;
  if (req.query.availableOnly === 'true') {
    filteredClasses = yogaClasses.filter(yogaClass => yogaClass.availableSpots > 0);
  }

  res.status(200).json({
    success: true,
    count: filteredClasses.length,
    data: filteredClasses
  });
});

//* Get single yoga class - Public
export const getYogaClass = asyncHandler(async (req, res, next) => {
  const yogaClass = await Yoga.findById(req.params.id)
    .populate('instructor', 'name email')
    .populate('enrolled.user', 'name email');

  if (!yogaClass) {
    return next(new ErrorResponse(`Yoga class not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: yogaClass
  });
});

//* Create new yoga class - Private (Admin/Instructor only)
export const createYogaClass = asyncHandler(async (req, res, next) => {
  //* Add instructor from logged in user if not provided
  if (!req.body.instructor) {
    req.body.instructor = req.user.id;
  }

  //* Validate that instructor exists and has instructor role
  if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
    return next(new ErrorResponse('Only instructors and admins can create yoga classes', 403));
  }

  const yogaClass = await Yoga.create(req.body);

  //* Populate instructor details for response
  await yogaClass.populate('instructor', 'name email');

  res.status(201).json({
    success: true,
    data: yogaClass
  });
});

//* Update yoga class - Private (Admin/Instructor who owns the class)
export const updateYogaClass = asyncHandler(async (req, res, next) => {
  let yogaClass = await Yoga.findById(req.params.id);

  if (!yogaClass) {
    return next(new ErrorResponse(`Yoga class not found with id of ${req.params.id}`, 404));
  }

  //* Check ownership (instructor can only update their own classes)
  if (yogaClass.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this yoga class', 403));
  }

  //* Update class
  yogaClass = await Yoga.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('instructor', 'name email');

  res.status(200).json({
    success: true,
    data: yogaClass
  });
});

//* Delete yoga class - Private (Admin/Instructor who owns the class)
export const deleteYogaClass = asyncHandler(async (req, res, next) => {
  const yogaClass = await Yoga.findById(req.params.id);

  if (!yogaClass) {
    return next(new ErrorResponse(`Yoga class not found with id of ${req.params.id}`, 404));
  }

  //* Check ownership
  if (yogaClass.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this yoga class', 403));
  }

  //* Check if class has active bookings
  const confirmedBookings = yogaClass.enrolled.filter(booking => booking.status === 'confirmed');
  if (confirmedBookings.length > 0) {
    return next(new ErrorResponse('Cannot delete class with active bookings. Cancel all bookings first.', 400));
  }

  await yogaClass.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Yoga class deleted successfully'
  });
});

//* Search yoga classes - Public
export const searchYogaClasses = asyncHandler(async (req, res, next) => {
  const { keyword, type, level, date, instructor } = req.query;

  //* Build search query
  let searchQuery = { isActive: true };

  //* Add text search if keyword provided
  if (keyword) {
    searchQuery.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } }
    ];
  }

  //* Add filters
  if (type) searchQuery.type = type;
  if (level) searchQuery.level = level;
  if (instructor) searchQuery.instructor = instructor;

  //* Date filtering (if specific date provided)
  if (date) {
    const searchDate = new Date(date);
    searchQuery['schedule.date'] = {
      $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
      $lt: new Date(searchDate.setHours(23, 59, 59, 999))
    };
  }

  const yogaClasses = await Yoga.find(searchQuery)
    .populate('instructor', 'name email')
    .sort({ 'schedule.startTime': 1 });

  res.status(200).json({
    success: true,
    count: yogaClasses.length,
    data: yogaClasses
  });
});