import express from 'express';
import {
    register,
    login,
    logout,
    getMe,
    updateDetails,
    updateProfile,
    updatePassword,
    deleteAccount
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//* public routes (no authentication required)
router.post('/register', register); //? means anyone can register
router.post('/login', login); //? means anyone can login

//* protected routes (authentication required)
router.use(protect); //* this protects all routes below 

router.post('/logout', logout); //? must be logged in to logout
router.get('/user-profile', getMe);//? must be logged in to see profile
router.put('/updatedetails', updateDetails);//? must be logged in to update details
router.put('/updateprofile', updateProfile);//? must be logged in to update profile (fitness goals, age, phone)
router.put('/updatepassword', updatePassword);//? must be logged in to change password
router.delete('/delete-account', deleteAccount); //? must be logged in to delete account

export default router;