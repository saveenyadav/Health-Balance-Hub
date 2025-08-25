import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from "./config/database.js";
import errorHandler from './middleware/errorhandler.js';
import authRoutes from './routes/auth.js';


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

//* Our basic first test route
app.get('/api/test', (req,res) => {
    res.json({
       message:'API test is working!', 
       timestamp: new Date().toISOString()
    });
});



//*Auth routes implemeted
app.use('/api/auth', authRoutes);

//* HBH Endpoints sofar:
//* Public (No Auth Required):
//   POST http://localhost:5001/api/auth/register
//   POST http://localhost:5001/api/auth/login
//* 
//* Protected (Require JWT Token in Authorization header):
//   POST http://localhost:5001/api/auth/logout
//   GET  http://localhost:5001/api/auth/user-profile
//   PUT  http://localhost:5001/api/auth/updatedetails
//   PUT  http://localhost:5001/api/auth/updatepassword
//* Example token header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...




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
  
});

//* Process-level error handlers (AFTER server starts)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

