import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferences: {
    favoriteYogaTypes: [{
      type: String,
      enum: ['hatha', 'vinyasa', 'ashtanga', 'yin', 'hot', 'restorative', 'meditation']
    }],
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    preferredTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      default: 'morning'
    },
    goals: [{
      type: String,
      enum: ['flexibility', 'strength', 'stress-relief', 'weight-loss', 'spiritual', 'meditation']
    }]
  },
  bookingStats: {
    totalClasses: {
      type: Number,
      default: 0
    },
    classesThisMonth: {
      type: Number,
      default: 0
    },
    classesThisYear: {
      type: Number,
      default: 0
    },
    favoriteInstructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    memberSince: {
      type: Date,
      default: Date.now
    },
    lastClassDate: {
      type: Date
    }
  },
  notifications: {
    bookingReminders: {
      type: Boolean,
      default: true
    },
    classUpdates: {
      type: Boolean,
      default: true
    },
    promotions: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

//* Virtual for user's current active bookings
userProfileSchema.virtual('currentBookings', {
  ref: 'Yoga',
  localField: 'user',
  foreignField: 'enrolled.user',
  justOne: false
});

//* Method to update booking stats
userProfileSchema.methods.updateBookingStats = function() {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  
  // These would be calculated from actual bookings in controller
  // This is just the method structure
  this.bookingStats.totalClasses += 1;
  this.bookingStats.lastClassDate = now;
  
  return this.save();
};

//* Indexes for performance
userProfileSchema.index({ user: 1 });
userProfileSchema.index({ 'preferences.fitnessLevel': 1 });
userProfileSchema.index({ 'bookingStats.totalClasses': -1 });


export default mongoose.model('UserProfile', userProfileSchema);