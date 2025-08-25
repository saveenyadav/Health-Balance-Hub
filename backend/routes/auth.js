import express from 'express';
import {
    register,
    login,
    logout,
    getMe,
    updateDetails,
    updatePassword
}from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//* Public routes (no authentication required)
router.post('/register', register); //? Means anyone can register
router.post('/login', login); //? means anyone can login

//* Protected routes (authentication required)
router.use(protect); //* This protects all routes below 

router.post('/logout', logout); //? Must be logged in to logout
router.get('/user-profile', getMe);//? Must be logged in to see profile
router.put('/updatedetails', updateDetails);//? Must be logged in to update details
router.put('/updatepassword', updatePassword);//? Must be logged in to change password

export default router;