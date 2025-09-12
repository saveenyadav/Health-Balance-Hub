import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ],
   
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    //* REMOVED minlength and validate here - we'll validate in pre-save hook
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'trainer', 'admin'],
    default: 'user'
  },
  profile: {
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone cannot exceed 20 characters'],
      match: [
        /^[\+]?[1-9][\d]{0,15}$/,
        'Please provide a valid phone number'
      ]
    },
    dateOfBirth: Date,
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    //* fitness goals for Health Balance Hub
    fitnessGoals: {
      type: [String],
      enum: ['weight-loss', 'muscle-gain', 'general-fitness', 'endurance', 'strength', 'flexibility'],
      validate: {
        validator: function(goals) {
          return goals.length <= 5; // Max 5 goals
        },
        message: 'You can select maximum 5 fitness goals'
      }
    },
    age: {
      type: Number,
      min: [13, 'Must be at least 13 years old'],
      max: [120, 'Please enter a valid age']
    },
    //* additional profile fields for better user experience
    height: {
      type: Number,
      min: [50, 'Height must be at least 50cm'],
      max: [300, 'Height cannot exceed 300cm']
    },
    weight: {
      type: Number,
      min: [20, 'Weight must be at least 20kg'],
      max: [500, 'Weight cannot exceed 500kg']
    },
    membershipPlan: {
      type: String,
      enum: ['trial', 'basic', 'premium', 'vip'],
      default: 'trial'
    },
    memberSince: {
      type: Date,
      default: Date.now
    }
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Yoga'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  //* enhanced security tracking
  lastLogin: Date,
  ipAddress: String,
  userAgent: String,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date
}, {
  timestamps: true
});

//* account lockout helper
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

//* validating password BEFORE hashing, then hash it
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  //* VALIDATING PASSWORD BEFORE HASHING (only if not already hashed)
  if (!this.password.startsWith('$2b$')) {
    //* Password length validation
    if (this.password.length < 6) {
      const error = new Error('Password must be at least 6 characters');
      error.name = 'ValidationError';
      return next(error);
    }
    
    //* Password pattern validation (must contain letters and numbers)
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(this.password)) {
      const error = new Error('Password must be at least 6 characters and contain both letters and numbers');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  
  //* Hash the password after validation
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//* compare password method with account lockout protection
userSchema.methods.comparePassword = async function(enteredPassword) {
  // Check if account is locked
  if (this.isLocked) {
    return false;
  }

  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  
  // Handle failed login attempts
  if (!isMatch) {
    this.loginAttempts += 1;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (this.loginAttempts >= 5) {
      this.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
    }
    
    await this.save();
    return false;
  }
  
  // Reset login attempts on successful login
  if (this.loginAttempts > 0) {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    await this.save();
  }
  
  return true;
};

//* generate JWT token method
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      role: this.role,
      email: this.email 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

//* update user activity method
userSchema.methods.updateLoginInfo = function(ipAddress, userAgent) {
  this.lastLogin = new Date();
  this.ipAddress = ipAddress;
  this.userAgent = userAgent;
  return this.save();
};

//* generate email verification token
userSchema.methods.getEmailVerificationToken = function() {
  const verificationToken = jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  this.emailVerificationToken = verificationToken;
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

//* indexes for better performance

userSchema.index({ 'profile.membershipPlan': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });

export default mongoose.model('User', userSchema);

//* user model with password validation, security features, and user feedback
//* includes account lockout protection, email verification, and profile management