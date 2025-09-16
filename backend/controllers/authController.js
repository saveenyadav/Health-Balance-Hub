// authController.js
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

//* register user
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorResponse('Please provide name, email and password', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorResponse('Please provide a valid email address', 400));
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  const ipAddress = req.ip || req.connection.remoteAddress || req.socket?.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  try {
    // Create user -- set top-level emailVerified false (keeps login check working)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      emailVerified: false, // top-level flag used by login() check
      profile: {
        membershipPlan: 'trial',
        memberSince: new Date(),
        fitnessLevel: 'beginner',
        emailVerified: false // keep in profile as well for UI compatibility
      },
      ipAddress,
      userAgent,
      lastLogin: new Date()
    });

    // Generate verification token (user.getEmailVerificationToken should set fields on user and return token)
    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${user.email}`;

    const mailOptions = {
      from: `"HBH-Team" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to Health Balance Hub – Please Verify Your Email',
      html: `
        <h2>Hi, ${user.name}! Welcome to Health Balance Hub</h2>
        <p>Thank you for registering. To activate your account, please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}" style="background:#FF5722;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Verify My Email</a></p>
        <p>If you did not sign up, please ignore this email.</p>
        <br>
        <p>Best regards,<br>Your Health Balance Hub Team</p>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Nodemailer error:', error);
      // continue — we still return success response, but you may want to notify admin in prod
    }

    // IMPORTANT: Do NOT auto-login here. Return success and let frontend redirect to login after verification.
    return res.status(201).json({
      success: true,
      message: `Welcome ${user.name}! Your account has been created. Please check your email to verify your account.`
    });

  } catch (error) {
    console.error('registration error:', error);

    if (error.name === 'ValidationError') {
      if (error.errors) {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return next(new ErrorResponse(validationErrors.join('. '), 400));
      }
      return next(new ErrorResponse(error.message, 400));
    }

    if (error.message && error.message.includes('Password must be')) {
      return next(new ErrorResponse(error.message, 400));
    }

    if (error.code === 11000) {
      return next(new ErrorResponse('User with this email already exists', 400));
    }

    return next(new ErrorResponse('Registration failed. Please try again.', 500));
  }
});

//* email verification endpoint
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token, email } = req.query;

  if (!token || !email) {
    return next(new ErrorResponse('Invalid verification link. Missing token or email.', 400));
  }

  try {
    // verify the token using jwt (throws if invalid/expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find the user by decoded id and email
    const user = await User.findOne({ _id: decoded.id, email: email.toLowerCase() });

    if (!user) {
      return next(new ErrorResponse('No account found for this email.', 404));
    }

    // mark verified (set both top-level and profile flag for compatibility)
    user.emailVerified = true;
    if (!user.profile) user.profile = {};
    user.profile.emailVerified = true;

    // clear any stored verification token/expiry fields if present
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    console.log(`Email verified for user: ${user.email} (id: ${user._id})`);

    // Frontend will handle the redirect to login
    return res.json({ success: true, message: 'Email verified!' });
  } catch (err) {
    console.error('verifyEmail error:', err);
    return next(new ErrorResponse('Invalid or expired verification link', 400));
  }
});

//* login user
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  // check top-level flag (we set this in register/verify)
  if (!user.emailVerified) {
    return next(new ErrorResponse('Please verify your email before logging in.', 401));
  }

  if (user.isLocked) {
    return next(new ErrorResponse('Account is temporarily locked. Try again later.', 423));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  const ipAddress = req.ip || req.connection.remoteAddress || req.socket?.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  await user.updateLoginInfo(ipAddress, userAgent);

  const token = generateToken({ id: user._id });

  res.status(200)
    .cookie('token', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
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

//* logout user
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

//* delete account
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new ErrorResponse('Please provide your password to confirm account deletion', 400));
  }

  const user = await User.findById(req.user.id).select('+password');
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Incorrect password. Account deletion cancelled', 401));
  }

  await User.findByIdAndDelete(req.user.id);

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully.'
  });
});

//* get current user
export const getMe = asyncHandler(async (req, res, next) => {
  const user = req.user;

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
export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = { name: req.body.name, email: req.body.email };

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

//* update profile
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
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide current password and new password', 400));
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken({ id: user._id });

  res.status(200)
    .cookie('token', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    .json({ success: true, message: 'Password updated successfully', token });
});

//* update membership
export const updateMembershipDetails = asyncHandler(async (req, res, next) => {
  const { plan, membershipDetails } = req.body;

  if (!plan || !plan.planName) {
    return next(new ErrorResponse('Please provide a valid membership plan', 400));
  }
  if (!membershipDetails) {
    return next(new ErrorResponse('Please provide membership registration details', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { 
      'profile.plan': plan,
      'profile.membershipDetails': membershipDetails
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Membership registration successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      memberSince: user.profile?.memberSince || user.createdAt,
      plan: user.profile?.plan,
      membershipDetails: user.profile?.membershipDetails
    }
  });
});

