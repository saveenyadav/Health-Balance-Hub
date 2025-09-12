


import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import nodemailer from 'nodemailer'; //*Added for sending emails
import crypto from 'crypto'; //* generating verification token

//* register user
//* post /api/auth/register
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
    //* create user with enhanced profile (password validated & hashed in User model pre-save)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      profile: {
        membershipPlan: 'trial',
        memberSince: new Date(),
        fitnessLevel: 'beginner',
        emailVerified: false
      },
      ipAddress,
      userAgent,
      lastLogin: new Date()
    });

    //* generate email verification token via model method
    const verificationToken = user.getEmailVerificationToken();
    await user.save(); // saves token & expiry

    //* Send verification email with NODEMAILER
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or any provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}&email=${user.email}`;

    const mailOptions = {
      from: `"HBH-Team" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to Health Balance Hub – Please Verify Your Email',
      html: `
        <h2>Hi, ${user.name}! Welcome to Health Balance Hub</h2>
        <p>Thank you for registering. To activate your account and get started, please verify your email by clicking the link below:</p>
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
    }

    //* generate JWT token
    const token = generateToken({ id: user._id });

    //* logging
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
        message: `Welcome ${user.name}! Your account has been created successfully. Please check your email to verify your account.`,
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

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return next(new ErrorResponse('No account found for this email.', 404));
  }

  if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
    return next(new ErrorResponse('Invalid or expired verification link', 400));
  }

  //* mark email verified
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  console.log(`Email verified for user: ${user.email} (id: ${user._id})`);

const frontendLoginUrl = process.env.FRONTEND_URL
  ? `${process.env.FRONTEND_URL}/login?verified=true`
  : 'http://localhost:5173/login?verified=true';
return res.redirect(frontendLoginUrl);

  //const frontendLoginUrl = 'http://localhost:5173/login?verified=true'; // updated by Okile

return res.redirect(frontendLoginUrl);
});

//* login user
//* post /api/auth/login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  if (!user.emailVerified) {
    return next(new ErrorResponse('Please verify your email before logging in.', 401));
  }

  if (user.isLocked) {
    return next(new ErrorResponse('Account is temporarily locked due to multiple failed login attempts. Please try again later.', 423));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  await user.updateLoginInfo(ipAddress, userAgent);

  const token = generateToken({ id: user._id });

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

//* logout user and clear JWT cookie
//* post /api/auth/logout
export const logout = asyncHandler(async (req, res, next) => {
  console.log('logout requested - clearing JWT cookie');
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  console.log('JWT cookie cleared successfully');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

//* delete user account
//* delete /api/auth/delete-account
//* private
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

  console.log('account deleted:', user.name, user.email, 'user id:', user._id);

  await User.findByIdAndDelete(req.user.id);

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

//* get current logged in user
//* get /api/auth/user-profile
//* private
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
//* put /api/auth/updatedetails
//* private
export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

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

  if (!(await user.comparePassword(currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  try {
    user.password = newPassword;
    await user.save();

    const token = generateToken({ id: user._id });

    console.log('password updated for user:', user.name, user.email);

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

    throw error;
  }
});

//* update membership details and plan
//* put /api/auth/register-membership
//* private
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

  console.log('membership registered:', user.name, user.email, 'plan:', plan.planName);

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












// import asyncHandler from '../middleware/asyncHandler.js';
// import ErrorResponse from '../utils/errorResponse.js';
// import User from '../models/User.js';
// import { generateToken } from '../utils/jwt.js';
// import nodemailer from 'nodemailer'; //*Added for sending emails
// import crypto from 'crypto'; //* generating verification token

// //* register user
// //* post /api/auth/register
// export const register = asyncHandler(async (req, res, next) => {
//   const { name, email, password } = req.body;

//   //* validation
//   if (!name || !email || !password) {
//     return next(new ErrorResponse('Please provide name, email and password', 400));
//   }

//   //* enhanced email validation
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return next(new ErrorResponse('Please provide a valid email address', 400));
//   }

//   //* check if user already exists
//   const existingUser = await User.findOne({ email: email.toLowerCase() });
//   if (existingUser) {
//     return next(new ErrorResponse('User already exists with this email', 400));
//   }

//   //* get ip address and user agent for security tracking
//   const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
//   const userAgent = req.get('User-Agent') || 'Unknown';

//   try {
//     //* create user with enhanced profile (password will be validated and hashed by user model pre-save middleware)
//     const verificationToken = crypto.randomBytes(32).toString('hex'); // Generate verification token

//     const user = await User.create({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       password,
//       profile: {
//         membershipPlan: 'trial',
//         memberSince: new Date(),
//         fitnessLevel: 'beginner',
//         emailVerificationToken: verificationToken,
//         emailVerified: false
//       },
//       ipAddress,
//       userAgent,
//       lastLogin: new Date()
//     });

//     //* Send verification email with NODEMAILER
//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // or any provider
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}&email=${user.email}`; // ::Updated by Okile

   
//     const mailOptions = {
//   from: `"HBH-Team" <${process.env.EMAIL_USER}>`,//* Improved sender format  */
//   to: user.email,
//   subject: 'Welcome to Health Balance Hub – Please Verify Your Email',
//   html: `
//     <h2>Hi, ${user.name}! Welcome to Health Balance Hub</h2>
//     <p>Thank you for registering. To activate your account and get started, please verify your email by clicking the link below:</p>
//     <p><a href="${verificationUrl}" style="background:#FF5722;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Verify My Email</a></p>
//     <p>If you did not sign up, please ignore this email.</p>
//     <br>
//     <p>Best regards,<br>Your Health Balance Hub Team</p>
//   `
// };

//     // Improved logging for email sending
//     try {
//       const info = await transporter.sendMail(mailOptions);
//       console.log('Email sent:', info.response);
//     } catch (error) {
//       console.error('Nodemailer error:', error);
//     }

//     //* generate token
//     const token = generateToken({ id: user._id });

//     //* enhanced logging
//     console.log('user registered:', name, email);
//     console.log('user saved to mongodb:', user._id);
//     console.log('security info - ip:', ipAddress, 'user agent:', userAgent.substring(0, 50));
//     console.log('jwt token generated:', token);
//     console.log('saved data:', {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       membershipPlan: user.profile.membershipPlan,
//       createdAt: user.createdAt
//     });

//     //* set cookie and respond
//     const options = {
//       expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict'
//     };

//     res.status(201)
//       .cookie('token', token, options)
//       .json({
//         success: true,
//         message: `Welcome ${user.name}! Your account has been created successfully. Please check your email to verify your account.`,
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           profile: user.profile,
//           createdAt: user.createdAt
//         }
//       });

//   } catch (error) {
//     console.error('registration error:', error);

//     if (error.name === 'ValidationError') {
//       if (error.errors) {
//         const validationErrors = Object.values(error.errors).map(err => err.message);
//         return next(new ErrorResponse(validationErrors.join('. '), 400));
//       }
//       return next(new ErrorResponse(error.message, 400));
//     }

//     if (error.message && error.message.includes('Password must be')) {
//       return next(new ErrorResponse(error.message, 400));
//     }

//     if (error.code === 11000) {
//       return next(new ErrorResponse('User with this email already exists', 400));
//     }

//     return next(new ErrorResponse('Registration failed. Please try again.', 500));
//   }
// });

// //* email verification endpoint
// export const verifyEmail = asyncHandler(async (req, res, next) => {
//   const { token, email } = req.query;
//   const user = await User.findOne({ email });

//   if (!user || user.profile.emailVerificationToken !== token) {
//     return next(new ErrorResponse('Invalid or expired verification link', 400));
//   }

//   user.profile.emailVerified = true;
//   user.profile.emailVerificationToken = undefined;
//   await user.save();

// //* After verifying email
//   const frontendLoginUrl = process.env.FRONTEND_URL
//     ? `${process.env.FRONTEND_URL}/login`
//     : 'http://localhost:3000/login'; //* fallback URL

//   return res.redirect(frontendLoginUrl);
// });

// //* login user
// //* post /api/auth/login
// export const login = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return next(new ErrorResponse('Please provide email and password', 400));
//   }

//   const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
//   if (!user) {
//     return next(new ErrorResponse('Invalid email or password', 401));
//   }

//   if (!user.profile.emailVerified) {
//     return next(new ErrorResponse('Please verify your email before logging in.', 401));
//   }

//   if (user.isLocked) {
//     return next(new ErrorResponse('Account is temporarily locked due to multiple failed login attempts. Please try again later.', 423));
//   }

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) {
//     return next(new ErrorResponse('Invalid email or password', 401));
//   }

//   const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
//   const userAgent = req.get('User-Agent') || 'Unknown';
  
//   await user.updateLoginInfo(ipAddress, userAgent);

//   const token = generateToken({ id: user._id });

//   console.log('user logged in:', user.name, user.email);
//   console.log('security info - ip:', ipAddress, 'user agent:', userAgent.substring(0, 50));
//   console.log('jwt token generated:', token);
//   console.log('login data:', {
//     id: user._id,
//     name: user.name,
//     email: user.email,
//     lastLogin: user.lastLogin,
//     membershipPlan: user.profile?.membershipPlan
//   });

//   const options = {
//     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict'
//   };

//   res.status(200)
//     .cookie('token', token, options)
//     .json({
//       success: true,
//       message: `Welcome back, ${user.name}!`,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         profile: user.profile,
//         lastLogin: user.lastLogin
//       }
//     });
// });

// //* delete user account
// //* delete /api/auth/delete-account
// //* private
// export const deleteAccount = asyncHandler(async (req, res, next) => {
//   const { password } = req.body;

//   if (!password) {
//     return next(new ErrorResponse('Please provide your password to confirm account deletion', 400));
//   }

//   const user = await User.findById(req.user.id).select('+password');

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) {
//     return next(new ErrorResponse('Incorrect password. Account deletion cancelled', 401));
//   }

//   console.log('account deleted:', user.name, user.email, 'user id:', user._id);

//   await User.findByIdAndDelete(req.user.id);

//   res.cookie('token', 'none', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true
//   });

//   res.status(200).json({
//     success: true,
//     message: 'Account deleted successfully. We are sorry to see you go!',
//     data: {}
//   });
// });

// //* get current logged in user
// //* get /api/auth/user-profile
// //* private
// export const getMe = asyncHandler(async (req, res, next) => {
//   const user = req.user;

//   res.status(200).json({
//     success: true,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       memberSince: user.profile?.memberSince || user.createdAt,
//       plan: user.profile?.plan || {
//         planName: "No active plan",
//         monthlyFee: null,
//         totalPrice: null,
//         paymentMethod: null
//       }
//     }
//   });
// });

// //* logout user and clear JWT cookie
// //* post /api/auth/logout
// export const logout = asyncHandler(async (req, res, next) => {
//   console.log('logout requested - clearing JWT cookie');
//   res.cookie('token', '', {
//     httpOnly: true,
//     expires: new Date(0),
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict'
//   });
//   console.log('JWT cookie cleared successfully');
//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });

// //* update user details
// //* put /api/auth/updatedetails
// //* private
// export const updateDetails = asyncHandler(async (req, res, next) => {
//   const fieldsToUpdate = {
//     name: req.body.name,
//     email: req.body.email
//   };

//   if (req.body.email) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(req.body.email)) {
//       return next(new ErrorResponse('Please provide a valid email address', 400));
//     }
//     fieldsToUpdate.email = req.body.email.toLowerCase().trim();
//   }

//   const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
//     new: true,
//     runValidators: true
//   });

//   console.log('user details updated:', user.name, user.email);

//   res.status(200).json({
//     success: true,
//     message: 'User details updated successfully',
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       profile: user.profile
//     }
//   });
// });

// //* update user profile
// //* put /api/auth/updateprofile
// //* private
// export const updateProfile = asyncHandler(async (req, res, next) => {
//   const { profile } = req.body;

//   if (!profile) {
//     return next(new ErrorResponse('Please provide profile data to update', 400));
//   }

//   const user = await User.findByIdAndUpdate(
//     req.user.id,
//     { profile: { ...req.user.profile, ...profile } },
//     { new: true, runValidators: true }
//   );

//   console.log('user profile updated:', user.name, user.email);
//   console.log('profile data:', profile);

//   res.status(200).json({
//     success: true,
//     message: 'Profile updated successfully',
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       profile: user.profile
//     }
//   });
// });

// //* update password
// //* put /api/auth/updatepassword
// //* private
// export const updatePassword = asyncHandler(async (req, res, next) => {
//   const { currentPassword, newPassword } = req.body;

//   if (!currentPassword || !newPassword) {
//     return next(new ErrorResponse('Please provide current password and new password', 400));
//   }

//   const user = await User.findById(req.user.id).select('+password');

//   if (!(await user.comparePassword(currentPassword))) {
//     return next(new ErrorResponse('Current password is incorrect', 401));
//   }

//   try {
//     user.password = newPassword;
//     await user.save();

//     const token = generateToken({ id: user._id });

//     console.log('password updated for user:', user.name, user.email);

//     const options = {
//       expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict'
//     };

//     res.status(200)
//       .cookie('token', token, options)
//       .json({
//         success: true,
//         message: 'Password updated successfully',
//         token
//       });

//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       if (error.errors) {
//         const validationErrors = Object.values(error.errors).map(err => err.message);
//         return next(new ErrorResponse(validationErrors.join('. '), 400));
//       }
//       return next(new ErrorResponse(error.message, 400));
//     }

//     if (error.message && error.message.includes('Password must be')) {
//       return next(new ErrorResponse(error.message, 400));
//     }

//     throw error;
//   }
// });

// //* update membership details and plan
// //* put /api/auth/register-membership
// //* private
// export const updateMembershipDetails = asyncHandler(async (req, res, next) => {
//   const { plan, membershipDetails } = req.body;

//   if (!plan || !plan.planName) {
//     return next(new ErrorResponse('Please provide a valid membership plan', 400));
//   }
//   if (!membershipDetails) {
//     return next(new ErrorResponse('Please provide membership registration details', 400));
//   }

//   const user = await User.findByIdAndUpdate(
//     req.user.id,
//     { 
//       'profile.plan': plan,
//       'profile.membershipDetails': membershipDetails
//     },
//     { new: true, runValidators: true }
//   );

//   console.log('membership registered:', user.name, user.email, 'plan:', plan.planName);

//   res.status(200).json({
//     success: true,
//     message: 'Membership registration successful',
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       memberSince: user.profile?.memberSince || user.createdAt,
//       plan: user.profile?.plan,
//       membershipDetails: user.profile?.membershipDetails
//     }
//   });
// });

// //* enhanced authentication controller with password validation, security tracking, and user feedback
// //* includes account lockout protection, error handling, and comprehensive logging
// // Storing membership