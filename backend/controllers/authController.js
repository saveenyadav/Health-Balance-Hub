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
    return next(new ErrorResponse('please provide name, email and password', 400));
  }

  //* check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('user already exists with this email', 400));
  }

  //* get ip address and user agent for security tracking (same pattern as contact)
  const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  //* create user (password will be hashed by user model pre-save middleware)
  const user = await User.create({
    name,
    email,
    password,
    ipAddress,
    userAgent
  });

  //* generate token
  const token = generateToken({ id: user._id });

  //* enhanced logging (same pattern as contact controller)
  console.log('user registered:', name, email);
  console.log('user saved to mongodb:', user._id);
  console.log('security info - ip:', ipAddress, 'user agent:', userAgent.substring(0, 50));
  console.log('saved data:', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
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
      message: 'user registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
});

//* login user
//* post /api/auth/login
//* public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //* validation
  if (!email || !password) {
    return next(new ErrorResponse('please provide email and password', 400));
  }

  //* check for user (include password for comparison)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('invalid credentials', 401));
  }

  //* check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('invalid credentials', 401));
  }

  //* update last login and security info (same pattern as contact)
  const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  user.lastLogin = new Date();
  user.ipAddress = ipAddress;
  user.userAgent = userAgent;
  await user.save();

  //* generate token
  const token = generateToken({ id: user._id });

  //* enhanced logging (same pattern as contact controller)
  console.log('user logged in:', user.name, user.email);
  console.log('security info - ip:', ipAddress, 'user agent:', userAgent.substring(0, 50));
  console.log('login data:', {
    id: user._id,
    name: user.name,
    email: user.email,
    lastLogin: user.lastLogin
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
      message: 'logged in successfully',
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

//* logout user / clear cookie
//* post /api/auth/logout
//* private
export const logout = asyncHandler(async (req, res, next) => {
  //* log logout activity
  console.log('user logged out:', req.user.id);

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'logged out successfully'
  });
});

//* get current logged in user
//* get /api/auth/user-profile
//* private
export const getMe = asyncHandler(async (req, res, next) => {
  //* user is already available in req.user from protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
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

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  //* enhanced logging
  console.log('user details updated:', user.name, user.email);

  res.status(200).json({
    success: true,
    message: 'user details updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

//* update user profile
//* put /api/auth/updateprofile
//* private
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { profile } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profile: { ...req.user.profile, ...profile } },
    { new: true, runValidators: true }
  );

  //* enhanced logging
  console.log('user profile updated:', user.name, user.email);

  res.status(200).json({
    success: true,
    message: 'profile updated successfully',
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
  const user = await User.findById(req.user.id).select('+password');

  //* check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new ErrorResponse('password is incorrect', 401));
  }

  user.password = req.body.newPassword;
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
      message: 'password updated successfully',
      token
    });
});

//* delete user account
//* delete /api/auth/delete-account
//* private
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  //* require password confirmation for security
  if (!password) {
    return next(new ErrorResponse('please provide your password to confirm account deletion', 400));
  }

  //* get user with password for verification
  const user = await User.findById(req.user.id).select('+password');

  //* verify password before deletion
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('incorrect password. account deletion cancelled', 401));
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
    message: 'account deleted successfully. we\'re sorry to see you go!',
    data: {}
  });
});

//* enhanced authentication controller with security tracking --- same as in contact 