import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    index: true
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
    maxlength: [100, 'Subject cannot exceed 100 characters'],
    minlength: [3, 'Subject must be at least 3 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
    minlength: [10, 'Message must be at least 10 characters']
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  // security tracking fields
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// checking for recent submissions (spam prevention)
contactSchema.statics.checkRecentSubmission = async function(email, minutes = 30) {
  const timeLimit = new Date(Date.now() - minutes * 60 * 1000);
  const recentSubmission = await this.findOne({
    email: email.toLowerCase(),
    createdAt: { $gte: timeLimit }
  });
  return !!recentSubmission;
};

export default mongoose.model('Contact', contactSchema);

