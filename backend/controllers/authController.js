
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

//* Register user
//* POST /api/auth/register

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  //* Validation
  if (!name || !email || !password) {
    return next(new ErrorResponse('Please provide name, email and password', 400));
  }

  //* Checking if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  //* Create user (password will be hashed by User model pre-save middleware)
  const user = await User.create({
    name,
    email,
    password
  });

  //* Generate token
  const token = generateToken({ id: user._id });

  //* Set cookie and respond
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict'
  };

  res.status(201)
    .cookie('token', token, options)
    .json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
});

//* Login user
//* POST /api/auth/login
//* Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //* Validation
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  //* Checking for user (include password for comparison)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  //* Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  //* Generating token
  const token = generateToken({ id: user._id });

  //* Setting cookie and respond
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
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
});

//* Logout user / clear cookie
//* POST /api/auth/logout
//* Private
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

//* Get current logged in user
//* GET /api/auth/user-profile
//* Private
export const getMe = asyncHandler(async (req, res, next) => {
  //* User is already available in req.user from protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt
    }
  });
});

//* Update user details
//* PUT /api/auth/updatedetails
//* Private
export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'User details updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

//* Update password
//* PUT /api/auth/updatepassword
//* Private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  //* Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  //* Generating new token
  const token = generateToken({ id: user._id });

  //* Set cookie and respond
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
});




//* Delete user account
//* DELETE /api/auth/delete-account
//* Private
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  //* Require password confirmation for security
  if (!password) {
    return next(new ErrorResponse('Please provide your password to confirm account deletion', 400));
  }

  //* Get user with password for verification
  const user = await User.findById(req.user.id).select('+password');

  //* Verify password before deletion
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Incorrect password. Account deletion cancelled.', 401));
  }

  //* Delete the user account
  await User.findByIdAndDelete(req.user.id);

  //* Clear cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully. We\'re sorry to see you go!',
    data: {}
  });
});