// BACKUP OF TEST ROUTES - FOR FUTURE REFERENCE
// These routes were used during authentication development and testing
// Created: August 22, 2025



// Development Testing Routes - Backup

//Authentication Testing Routes Used During Development

// JWT Testing
//- `GET /api/test-jwt` - Generate test tokens
//- `GET /api/debug-token` - Decode token content

// Auth Middleware Testing  
//- `GET /api/test-protected` - Test authentication middleware
//- `GET /api/test-admin` - Test role-based authorization

//User Management Testing
//- `POST /api/test-user` - Create test users
//- `DELETE /api/delete-test-user/:email` - Delete test users
//- `GET /api/debug-user/:email` - Check user in database
//- `GET /api/test-db` - List all users

 //Test Results (August 22, 2025)
// JWT generation working
// Authentication middleware working  
// Role-based authorization working
// Database connection working

//Test User Created
//- ID: 68a848ad4804c4b6501878d8
//- Email: authenticateduser@example.com
//- Name: Authenticated Test User

import express from 'express';
import jwt from 'jsonwebtoken';
import { generateToken, generateRefreshToken } from './utils/jwt.js';
import { protect, authorize } from './middleware/auth.js';
import User from './models/User.js';

// NOTE: These routes are NOT imported anywhere - just for reference

//*  JWT Test Route
app.get('/api/test-jwt', (req, res) => {
  try {
    console.log('Testing JWT utilities...');
    
    const testPayload = { id: '68a848ad4804c4b6501878d8' };
    
    const token = generateToken(testPayload);
    const refreshToken = generateRefreshToken(testPayload);
    
    console.log('JWT tokens generated successfully');
    
    res.json({
      success: true,
      message: 'JWT utilities working perfectly!',
      data: {
        tokenGenerated: true,
        refreshTokenGenerated: true,
        tokenPreview: token.substring(0, 50) + '...',
        refreshTokenPreview: refreshToken.substring(0, 50) + '...',
        tokenLength: token.length,
        refreshTokenLength: refreshToken.length,
        jwtSecret: process.env.JWT_SECRET ? 'Found' : 'Missing',
        jwtExpire: process.env.JWT_EXPIRE,
        fullToken: token
      }
    });
  } catch (error) {
    console.log('JWT test failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'JWT utilities failed',
      error: error.message,
      stack: error.stack
    });
  }
});

//* Test protected route (requires authentication)
app.get('/api/test-protected', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to protected route!',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

//* Test admin route (requires authentication + admin role)
app.get('/api/test-admin', protect, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to admin-only route!',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

//* Debug route to check what's inside the token
app.get('/api/debug-token', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({
      success: true,
      decodedToken: decoded,
      userIdInToken: decoded.id,
      tokenExp: new Date(decoded.exp * 1000)
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

//* Debug route to check actual user in database
app.get('/api/debug-user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    
    if (!user) {
      return res.json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      actualUserId: user._id.toString(),
      userDetails: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

//* create a test user -route (development only)
app.post('/api/test-user', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const newUser = await User.create({ name, email, password });
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.json({ message: 'Test user created!', user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//* Temporary route to delete test users (development only)
app.delete('/api/delete-test-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const deletedUser = await User.findOneAndDelete({ email });
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Test user deleted successfully',
      deletedUser: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

//* MongoDB connection test route (development-only)
app.get('/api/test-db', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ message: "DB: Working Perfectly!", users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ERROR TEST URLS
//GET http://localhost:5001/api/test
// GET http://localhost:5001/api/test-error
// GET http://localhost:5001/api/test-jwt 
// GET http://localhost:5001/api/nonexistent
// GET http://localhost:5001/api/test-protected (with Authorization header)