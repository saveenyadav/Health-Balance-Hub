import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from "./config/database.js";
import errorHandler from './middleware/errorhandler.js';




dotenv.config()//* Loads our env variables.

connectDB();//* connects to our DB

const app = express();//* initializes Express App instance

// Security Middleware
app.use(cors()) //* CORS (Cross-Origin Resource Sharing) is a middlewar function.
app.use(helmet()) //*for securing HTTP headers and injection prevention

//* Body Parser Middleware
app.use(express.json())  //* tells the app (const app = express(); to use json data)
app.use(express.urlencoded({extended:true})) //* enable app read url-encoded data

//* Our first test route
app.get ('/api/test', (req,res) => {
    res.json({
       message:'API test is working!', 
       timestamp: new Date().toISOString()
    });
});

//* Testing global errorHandler
app.get ('/api/test-error', (req,res, next) => {
   const error = new Error('This is just a test error');
  error.statusCode = 400;
  next(error);
});

//*Ungandled routes handling
app.use ('*', (req,res, next) => {
   const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);//*Must always be the last Middleware as used here


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// ERROR TEST URLS
//GET http://localhost:5000/api/test
// GET http://localhost:5000/api/test-error
// GET http://localhost:5000/api/nonexistent