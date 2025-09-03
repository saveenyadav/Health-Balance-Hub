import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  }, 
  // had to remove these to match frontend form
  //*  category field - keeping it simple for frontend compatibility
  //* priority field - not needed for basic contact form
  //* assignedTo field - not needed for basic contact form
  //*  response field - not needed for basic contact form

  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true
});

export default mongoose.model('Contact', contactSchema);

//* Simplified contact form schema - matches frontend exactly