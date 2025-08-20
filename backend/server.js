import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from "./config/database.js";
import errorHandler from './middleware/errorhandler.js';
import User from './models/User.js';




dotenv.config()//* Loads our env variables.

connectDB();//* connects to our DB

const app = express();//* initializes Express App instance

//* Security Middleware
app.use(cors()) //* CORS (Cross-Origin Resource Sharing) is a middlewar function.
app.use(helmet()) //*for securing HTTP headers and injection prevention

//* Body Parser Middleware
app.use(express.json())  //* tells the app (const app = express(); to use json data)
app.use(express.urlencoded({extended:true})) //* enable app read url-encoded data

//* Our first test route
app.get('/api/test', (req,res) => {
    res.json({
       message:'API test is working!', 
       timestamp: new Date().toISOString()
    });
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
      delete userResponse.password; // remove password from response

      res.json({ message: 'Test user created!', user: userResponse });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });




  //* MongoDB connection test route (development-only)
  app.get('/api/test-db', async (req, res) => {
    try {
      const users = await User.find().select('-password'); // exclude passwords
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
});

// 4. Process-level error handlers (AFTER server starts)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});


// ERROR TEST URLS
//GET http://localhost:5001/api/test
// GET http://localhost:5001/api/test-error
// GET http://localhost:5001/api/nonexistent