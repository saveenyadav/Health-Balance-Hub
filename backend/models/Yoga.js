import mongoose from 'mongoose';

const yogaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a class title'],
    trim: true,
    maxlength: [100, 'Title cannnot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a class description'],
    maxlength: [500, 'Description cannnot exceed 500 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['hatha', 'vinyasa', 'ashtanga', 'yin', 'hot', 'restorative', 'meditation'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    required: true
  },
  duration: {
    type: Number, //*/ in minutes
    required: [true, 'Please provide class duration'],
    min: [15, 'Class must be at least 15 minutes'],
    max: [180, 'Class cannnot exceed 3 hours']
  },
  schedule: {
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    recurring: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none'
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide class capacity'],
    min: [1, 'Capacity must be at least 1'],
    max: [50, 'Capacity cannot exceed 50']
  },
  enrolled: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bookedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['confirmed', 'waitlist', 'cancelled'],
      default: 'confirmed'
    }
  }],
  price: {
    type: Number,
    required: [true, 'Please provide class price'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    type: String,
    enum: ['studio-1', 'studio-2', 'outdoor', 'online'],
    required: true
  },
  equipment: [{
    type: String,
    enum: ['mat', 'blocks', 'straps', 'bolsters', 'blankets', 'none']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

//* Virtual for available spots
yogaSchema.virtual('availableSpots').get(function() {
  const confirmedEnrollments = this.enrolled.filter(e => e.status === 'confirmed');
  return this.capacity - confirmedEnrollments.length;
});

//* Method to check if class is full
yogaSchema.methods.isFull = function() {
  return this.availableSpots <= 0;
};



//* indexes for performance 
yogaSchema.index({ 'schedule.startTime': 1 }); //*  Fast class scheduling queries
yogaSchema.index({ type: 1, level: 1 }); //*  Efficient filtering by class type and difficulty
yogaSchema.index({ instructor: 1 });  //*  Quick instructor-based searches
yogaSchema.index({ location: 1 });  //*  Fast studio/location filtering
yogaSchema.index({ isActive: 1 });  //* Rapid active class queries


export default mongoose.model('Yoga', yogaSchema);

//* yoga class schema with booking system