import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

//* register user
//* post /api/auth/register
//* public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  //* validation
  if (!name || !email || !password) {
    return next(new ErrorResponse('Please provide name, email and password', 400));
  }

  //* enhanced email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorResponse('Please provide a valid email address', 400));
  }

  //* check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  //* get ip address and user agent for security tracking
  const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  try {
    //* create user with enhanced profile (password will be validated and hashed by user model pre-save middleware)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      profile: {
        membershipPlan: 'trial',
        memberSince: new Date(),
        fitnessLevel: 'beginner'
      },
      ipAddress,
      userAgent,
      lastLogin: new Date()
    });

    //* generate token
    const token = generateToken({ id: user._id });

    //* enhanced logging (same pattern as contact controller)
    console.log('user registered:', name, email);
    console.log('user saved to mongodb:', user._id);
    console.log('security info - ip:', ipAddress, 'user agent:', userAgent.substring(0, 50));
    console.log('jwt token generated:', token);
    console.log('saved data:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      membershipPlan: user.profile.membershipPlan,
      createdAt: user.createdAt
    });

    //* set cookie and respond
    const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(201)
      .cookie('token', token, options)
      .json({
        success: true,
        message: `Welcome ${user.name}! Your account has been created successfully.`,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile,
          createdAt: user.createdAt
        }
      });

  } catch (error) {
    console.error('registration error:', error);

    //* FIXED: handle password validation errors from User model pre-save hook
    if (error.name === 'ValidationError') {
      //* if it's a mongoose validation error, extract the message
      if (error.errors) {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return next(new ErrorResponse(validationErrors.join('. '), 400));
      }
      //* if it's a custom validation error from pre-save hook
      return next(new ErrorResponse(error.message, 400));
    }

    //* handle password validation errors from pre-save hook (custom errors)
    if (error.message && error.message.includes('Password must be')) {
      return next(new ErrorResponse(error.message, 400));
    }

    //* handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return next(new ErrorResponse('User with this email already exists', 400));
    }

    //* handle other errors
    return next(new ErrorResponse('Registration failed. Please try again.', 500));
  }
});

//* login user
//* post /api/auth/login
//* public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //* validation
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  //* check for user (include password for comparison)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  //* check if account is locked
  if (user.isLocked) {
    return next(new ErrorResponse('Account is temporarily locked due to multiple failed login attempts. Please try again later.', 423));
  }

  //* check if password matches (this also handles login attempts tracking)
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  //* update last login and security info
  const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  await user.updateLoginInfo(ipAddress, userAgent);

  //* generate token
  const token = generateToken({ id: user._id });

  //* enhanced logging (same pattern as contact controller)
  console.log('user logged in:', user.name, user.email);
  console.log('security info - ip:', ipAddress, 'user agent:', userAgent.substring(0, 50));
  console.log('jwt token generated:', token);
  console.log('login data:', {
    id: user._id,
    name: user.name,
    email: user.email,
    lastLogin: user.lastLogin,
    membershipPlan: user.profile?.membershipPlan
  });

  //* set cookie and respond
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(200)
    .cookie('token', token, options)
    .json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        lastLogin: user.lastLogin
      }
    });
});

//* logout user and clear JWT cookie - FIXED VERSION
//* post /api/auth/logout
//* public (no authentication required)
export const logout = asyncHandler(async (req, res, next) => {
  //* log logout activity - handle case where user might not be authenticated
  console.log('logout requested - clearing JWT cookie');
  
  //* clear the JWT cookie with proper options
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), //* expire immediately
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  console.log('JWT cookie cleared successfully');

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

//* get current logged in user
//* get /api/auth/user-profile
//* private
export const getMe = asyncHandler(async (req, res, next) => {
  //* user is already available in req.user from protect middleware
  const user = req.user;

  // Clean response to match frontend Profile.jsx expectations
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      memberSince: user.profile?.memberSince || user.createdAt,
      plan: user.profile?.plan || {
        planName: "No active plan",
        monthlyFee: null,
        totalPrice: null,
        paymentMethod: null
      }
    }
  });
});

//* update user details
//* put /api/auth/updatedetails
//* private
export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  //* validate email if provided
  if (req.body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return next(new ErrorResponse('Please provide a valid email address', 400));
    }
    fieldsToUpdate.email = req.body.email.toLowerCase().trim();
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  //* enhanced logging
  console.log('user details updated:', user.name, user.email);

  res.status(200).json({
    success: true,
    message: 'User details updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile
    }
  });
});

//* update user profile
//* put /api/auth/updateprofile
//* private
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { profile } = req.body;

  if (!profile) {
    return next(new ErrorResponse('Please provide profile data to update', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profile: { ...req.user.profile, ...profile } },
    { new: true, runValidators: true }
  );

  //* enhanced logging
  console.log('user profile updated:', user.name, user.email);
  console.log('profile data:', profile);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile
    }
  });
});

//* update password
//* put /api/auth/updatepassword
//* private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide current password and new password', 400));
  }

  const user = await User.findById(req.user.id).select('+password');

  //* check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  try {
    user.password = newPassword;
    await user.save();

    //* generate new token
    const token = generateToken({ id: user._id });

    //* enhanced logging
    console.log('password updated for user:', user.name, user.email);

    //* set cookie and respond
    const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(200)
      .cookie('token', token, options)
      .json({
        success: true,
        message: 'Password updated successfully',
        token
      });

  } catch (error) {
    //* handle password validation errors from User model
    if (error.name === 'ValidationError') {
      if (error.errors) {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return next(new ErrorResponse(validationErrors.join('. '), 400));
      }
      return next(new ErrorResponse(error.message, 400));
    }

    //* handle password validation errors from pre-save hook
    if (error.message && error.message.includes('Password must be')) {
      return next(new ErrorResponse(error.message, 400));
    }

    throw error;
  }
});

//* delete user account
//* delete /api/auth/delete-account
//* private
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  //* require password confirmation for security
  if (!password) {
    return next(new ErrorResponse('Please provide your password to confirm account deletion', 400));
  }

  //* get user with password for verification
  const user = await User.findById(req.user.id).select('+password');

  //* verify password before deletion
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Incorrect password. Account deletion cancelled', 401));
  }

  //* enhanced logging before deletion
  console.log('account deleted:', user.name, user.email, 'user id:', user._id);

  //* delete the user account
  await User.findByIdAndDelete(req.user.id);

  //* clear cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully. We are sorry to see you go!',
    data: {}
  });
});

//* enhanced authentication controller with password validation, security tracking, and user feedback
//* includes account