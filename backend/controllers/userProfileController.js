import UserProfile from '../models/UserProfile.js';
import Yoga from '../models/Yoga.js';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';

//* Get user profile - Private
export const getUserProfile = asyncHandler(async (req, res, next) => {
  let userProfile = await UserProfile.findOne({ user: req.user.id })
    .populate('user', 'name email')
    .populate('bookingStats.favoriteInstructor', 'name email');

  //* Create profile if it doesn't exist
  if (!userProfile) {
    userProfile = await UserProfile.create({ user: req.user.id });
    await userProfile.populate('user', 'name email');
  }

  res.status(200).json({
    success: true,
    data: userProfile
  });
});

//* Update user profile - Private
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { preferences, notifications, emergencyContact } = req.body;

  let userProfile = await UserProfile.findOne({ user: req.user.id });

  //* Create profile if it doesn't exist
  if (!userProfile) {
    userProfile = await UserProfile.create({ 
      user: req.user.id,
      preferences,
      notifications,
      emergencyContact
    });
  } else {
    //* Update existing profile
    if (preferences) userProfile.preferences = { ...userProfile.preferences, ...preferences };
    if (notifications) userProfile.notifications = { ...userProfile.notifications, ...notifications };
    if (emergencyContact) userProfile.emergencyContact = { ...userProfile.emergencyContact, ...emergencyContact };
    
    await userProfile.save();
  }

  await userProfile.populate('user', 'name email');

  res.status(200).json({
    success: true,
    data: userProfile,
    message: 'Profile updated successfully'
  });
});

//* Update fitness preferences - Private
export const updateFitnessPreferences = asyncHandler(async (req, res, next) => {
  const { favoriteYogaTypes, fitnessLevel, preferredTime, goals } = req.body;

  let userProfile = await UserProfile.findOne({ user: req.user.id });

  if (!userProfile) {
    userProfile = await UserProfile.create({ user: req.user.id });
  }

  //* Update preferences
  if (favoriteYogaTypes) userProfile.preferences.favoriteYogaTypes = favoriteYogaTypes;
  if (fitnessLevel) userProfile.preferences.fitnessLevel = fitnessLevel;
  if (preferredTime) userProfile.preferences.preferredTime = preferredTime;
  if (goals) userProfile.preferences.goals = goals;

  await userProfile.save();
  await userProfile.populate('user', 'name email');

  res.status(200).json({
    success: true,
    data: userProfile,
    message: 'Fitness preferences updated successfully'
  });
});

//* Get user dashboard data - Private
export const getUserDashboard = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  //* Get user profile
  let userProfile = await UserProfile.findOne({ user: userId })
    .populate('bookingStats.favoriteInstructor', 'name email');

  if (!userProfile) {
    userProfile = await UserProfile.create({ user: userId });
  }

  //* Get upcoming bookings
  const upcomingBookings = await Yoga.find({
    'enrolled.user': userId,
    'enrolled.status': { $in: ['confirmed', 'waitlist'] },
    'schedule.date': { $gte: new Date() }
  })
  .populate('instructor', 'name email')
  .sort({ 'schedule.date': 1 })
  .limit(5);

  //* Get recent booking history
  const recentHistory = await Yoga.find({
    'enrolled.user': userId,
    'schedule.date': { $lt: new Date() }
  })
  .populate('instructor', 'name email')
  .sort({ 'schedule.date': -1 })
  .limit(5);

  //* Get recommended classes based on preferences
  const recommendations = await getRecommendedClasses(userId, userProfile.preferences);

  //* Calculate this month's stats
  const thisMonth = new Date();
  const startOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
  
  const monthlyBookings = await Yoga.find({
    'enrolled.user': userId,
    'enrolled.status': 'confirmed',
    'schedule.date': { $gte: startOfMonth }
  }).countDocuments();

  //* Dashboard data
  const dashboardData = {
    profile: userProfile,
    stats: {
      totalClasses: userProfile.bookingStats.totalClasses,
      classesThisMonth: monthlyBookings,
      memberSince: userProfile.bookingStats.memberSince,
      favoriteInstructor: userProfile.bookingStats.favoriteInstructor
    },
    upcomingBookings: upcomingBookings.map(yoga => ({
      _id: yoga._id,
      title: yoga.title,
      type: yoga.type,
      level: yoga.level,
      instructor: yoga.instructor,
      schedule: yoga.schedule,
      location: yoga.location,
      userBooking: yoga.enrolled.find(b => b.user.toString() === userId)
    })),
    recentHistory: recentHistory.map(yoga => ({
      _id: yoga._id,
      title: yoga.title,
      type: yoga.type,
      instructor: yoga.instructor,
      schedule: yoga.schedule,
      userBooking: yoga.enrolled.find(b => b.user.toString() === userId)
    })),
    recommendations
  };

  res.status(200).json({
    success: true,
    data: dashboardData
  });
});

//* Get user booking statistics - Private
export const getUserStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  //* Get all user bookings for detailed stats
  const allBookings = await Yoga.find({
    'enrolled.user': userId
  }).populate('instructor', 'name email');

  //* Calculate detailed statistics
  const stats = {
    totalBookings: 0,
    confirmedClasses: 0,
    cancelledClasses: 0,
    waitlistClasses: 0,
    favoriteTypes: {},
    favoriteInstructors: {},
    monthlyActivity: {}
  };

  allBookings.forEach(yoga => {
    const userBooking = yoga.enrolled.find(b => b.user.toString() === userId);
    if (userBooking) {
      stats.totalBookings++;
      
      //* Count by status
      if (userBooking.status === 'confirmed') stats.confirmedClasses++;
      else if (userBooking.status === 'cancelled') stats.cancelledClasses++;
      else if (userBooking.status === 'waitlist') stats.waitlistClasses++;

      //* Count favorite types
      stats.favoriteTypes[yoga.type] = (stats.favoriteTypes[yoga.type] || 0) + 1;

      //* Count favorite instructors
      const instructorName = yoga.instructor.name;
      stats.favoriteInstructors[instructorName] = (stats.favoriteInstructors[instructorName] || 0) + 1;

      //* Monthly activity
      const month = new Date(userBooking.bookingDate).toISOString().substr(0, 7);
      stats.monthlyActivity[month] = (stats.monthlyActivity[month] || 0) + 1;
    }
  });

  //* Find most frequent type and instructor
  const mostFrequentType = Object.keys(stats.favoriteTypes).reduce((a, b) => 
    stats.favoriteTypes[a] > stats.favoriteTypes[b] ? a : b, '');
  
  const mostFrequentInstructor = Object.keys(stats.favoriteInstructors).reduce((a, b) => 
    stats.favoriteInstructors[a] > stats.favoriteInstructors[b] ? a : b, '');

  //* Update user profile with favorite instructor
  if (mostFrequentInstructor) {
    const instructor = await User.findOne({ name: mostFrequentInstructor });
    if (instructor) {
      await UserProfile.findOneAndUpdate(
        { user: userId },
        { 'bookingStats.favoriteInstructor': instructor._id }
      );
    }
  }

  res.status(200).json({
    success: true,
    data: {
      ...stats,
      insights: {
        mostFrequentType,
        mostFrequentInstructor,
        averageClassesPerMonth: stats.totalBookings / Object.keys(stats.monthlyActivity).length || 0
      }
    }
  });
});

//* Helper function to get recommended classes
const getRecommendedClasses = async (userId, preferences) => {
  const query = { isActive: true };

  //* Filter by user preferences
  if (preferences.favoriteYogaTypes && preferences.favoriteYogaTypes.length > 0) {
    query.type = { $in: preferences.favoriteYogaTypes };
  }

  if (preferences.fitnessLevel) {
    query.level = preferences.fitnessLevel;
  }

  //* Exclude classes user is already enrolled in
  const enrolledClasses = await Yoga.find({
    'enrolled.user': userId,
    'enrolled.status': { $in: ['confirmed', 'waitlist'] }
  }).select('_id');

  const enrolledIds = enrolledClasses.map(c => c._id);
  if (enrolledIds.length > 0) {
    query._id = { $nin: enrolledIds };
  }

  //* Get available classes with spots
  const recommendations = await Yoga.find(query)
    .populate('instructor', 'name email')
    .sort({ 'schedule.date': 1 })
    .limit(3);

  return recommendations.filter(yoga => yoga.availableSpots > 0);
};