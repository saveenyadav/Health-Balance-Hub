import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from "./config/database.js";
import errorHandler from './middleware/errorhandler.js';
import User from './models/User.js';
import { generateToken, generateRefreshToken } from './utils/jwt.js';



dotenv.config()//* Loads our env variables.

connectDB();//* connects to our DB

const app = express();//* initializes Express App instance

//* Security Middleware
app.use(cors()) //* CORS (Cross-Origin Resource Sharing) is a middlewar function.
app.use(helmet()) //*for securing HTTP headers and injection prevention

//* Body Parser Middleware
app.use(express.json())  //* tells the app (const app = express(); to use json data)
app.use(express.urlencoded({extended:true})) //* enable app read url-encoded data
app.use(cookieParser());


//* Our first test route
app.get('/api/test', (req,res) => {
    res.json({
       message:'API test is working!', 
       timestamp: new Date().toISOString()
    });
});

//*  JWT Test Route
app.get('/api/test-jwt', (req, res) => {
  try {
    console.log('Testing JWT utilities...');
    
    const testPayload = { id: '507f1f77bcf86cd799439011' };
    
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
        jwtExpire: process.env.JWT_EXPIRE
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



//* Creating a test-User. Successfull tested with Postman and MongoDb
//* ONLY for Development Environment
if (process.env.NODE_ENV === 'development') {

  //* create a test user -route (development only)
  app.post('/api/test-user', async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }

      const newUser = await User.create({ name, email, password });
      const userResponse = newUser.toObject();
      delete userResponse.password; //* remove password from response

      res.json({ message: 'Test user created!', user: userResponse });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



  //* MongoDB connection test route (development-only)
  app.get('/api/test-db', async (req, res) => {
    try {
      const users = await User.find().select('-password'); //* Hashes by excluding passwords
      res.json({ message: "DB: Working Perfectly!", users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}



//* Testing global errorHandler
app.get('/api/test-error', (req,res, next) => {
   const error = new Error('This is just a test error');
  error.statusCode = 400;
  next(error);
});

//*Unhandled routes handling
app.all('*', (req,res, next) => {
   const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);//*Must always be the last Middleware as used here


const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
   console.log(`Test JWT at: http://localhost:${PORT}/api/test-jwt`); 
});

//* Process-level error handlers (AFTER server starts)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});


// ERROR TEST URLS
//GET http://localhost:5001/api/test
// GET http://localhost:5001/api/test-error
// GET http://localhost:5001/api/test-jwt 
// GET http://localhost:5001/api/nonexistent