import express from 'express';
import {
    register,
    login,
    logout,
    getMe,
    updateDetails,
    updateProfile,
    updatePassword,
    deleteAccount,
    updateMembershipDetails, //* membership registration controller
    verifyEmail //* email verification controller
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


//* Public Routes (no auth required)

router.post('/register', register); // anyone can register
router.post('/login', login); // anyone can login
router.post('/logout', logout); // logout works even with expired/invalid tokens
router.get('/logout', logout); // allow GET request for browser access
router.get('/verify-email', verifyEmail); // email verification link


//* Protected Routes (auth required)

router.use(protect); //* all routes below require authentication

router.get('/user-profile', getMe); // logged-in user profile
router.put('/updatedetails', updateDetails); // update name/email
router.put('/updateprofile', updateProfile); // update profile (fitness goals, age, phone)
router.put('/updatepassword', updatePassword); // change password
router.delete('/delete-account', deleteAccount); // delete account
router.put('/register-membership', updateMembershipDetails); // register/update membership

export default router;




