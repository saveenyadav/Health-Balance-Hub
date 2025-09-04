import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'], // ADD: Min length
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true, //*trim whitespace
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    index: true //*for faster queries
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'trainer', 'admin'],
    default: 'user'
  },
  profile: {
    avatar: String,
    bio: String,
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone cannot exceed 20 characters'] // ADD: Validation
    },
    dateOfBirth: Date,
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    //* fitness goals (forHealth Balance Hub)
    fitnessGoals: {
      type: [String],
      enum: ['weight-loss', 'muscle-gain', 'general-fitness', 'endurance', 'strength', 'flexibility']
    },
    age: {
      type: Number,
      min: [13, 'Must be at least 13 years old'],
      max: [120, 'Please enter a valid age']
    }
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Yoga'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  //* Security tracking (same pattern as Contact model)
  lastLogin: Date,
  ipAddress: String,
  userAgent: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

//*Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12); //*IMPROVED: Higher salt rounds
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//*compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//*generate JWT token method
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export default mongoose.model('User', userSchema);

//*enhanced user authentication and profile schema with security features