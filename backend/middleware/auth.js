import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

//* Protects routes - middleware that requires authentication
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  //* Check for token in Authorization header or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //* Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    //* Set token from cookie
    token = req.cookies.token;
  }

  //* Making sure token exists and if NONE, block access
  if (!token) {
    return next(new ErrorResponse('Route access unauthorized', 401));
    //* Immediately stops the http request if no token is present.
  }

  try {
    //* Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //* Get user from token and add to req object
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('No user found with this id', 404));
    }

    next(); //* Continue to next middleware/route handler
  } catch (err) {
    return next(new ErrorResponse('Route access unauthorized', 401));
  }
});

//* Grant access to specific roles - middleware for role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};