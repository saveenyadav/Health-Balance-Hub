import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from "./config/database.js";
import errorHandler from './middleware/errorHandler.js';

//* Import all route files
import authRoutes from './routes/authRoutes.js';
import yogaRoutes from './routes/yogaRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js';
import blogRoutes from './routes/blogRoutes.js';           
import contactRoutes from './routes/contactRoutes.js';

//* Load environment variables
dotenv.config();

//* Validate required environment variables
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error('Missing required environment variables (JWT_SECRET, MONGO_URI)');
  process.exit(1);
}

//* Connect to database
connectDB();

//* Initialize Express app
const app = express();

//* Security Middleware
//* CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

//* Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}
app.use(helmet()); //* Security headers protection

//* Body Parser Middleware
app.use(express.json({ limit: '10mb' })); // JSON parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL-encoded parser
app.use(cookieParser()); // Cookie parser

//* API Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
       status: 'success',
       message: 'Health Balance Hub API is running!', 
       timestamp: new Date().toISOString(),
       version: '1.0.0'
    });
});

//* API Routes
app.use('/api/auth', authRoutes);              //? Authentication system
app.use('/api/yoga-classes', yogaRoutes);      //? Yoga class management
app.use('/api/bookings', bookingRoutes);       //? Booking system
app.use('/api/user-profile', userProfileRoutes); //? User profiles & dashboard
app.use('/api/blogs', blogRoutes);             //? Blog management
app.use('/api/contact', contactRoutes);        //? Contact form system

//* API Documentation Endpoint
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Health Balance Hub API',
        version: '1.0.0',
        endpoints: {
            authentication: '/api/auth',
            yogaClasses: '/api/yoga-classes',
            bookings: '/api/bookings',
            userProfile: '/api/user-profile',
            blogs: '/api/blogs',
            contact: '/api/contact',
            health: '/api/health'
        },
        documentation: 'See API_ENDPOINTS.md for detailed documentation'
    });
});

//* Error Testing Route (Development only)
if (process.env.NODE_ENV === 'development') {
    app.get('/api/test-error', (req, res, next) => {
       const error = new Error('This is a test error for development');
       error.statusCode = 400;
       next(error);
    });
}

//* Handle unmatched routes (404)
app.all('*', (req, res, next) => {
   const error = new Error(`Route ${req.originalUrl} not found`);
   error.statusCode = 404;
   next(error);
});

//* Global error handler (must be last middleware)
app.use(errorHandler);

//* Start server
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

});

//* Graceful shutdown handlers
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});