import Contact from '../models/Contact.js';

// Submit contact form (public route)
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Spam prevention - check for recent submissions
    const hasRecentSubmission = await Contact.checkRecentSubmission(email, 30);
    if (hasRecentSubmission) {
      return res.status(429).json({
        success: false,
        error: 'Please wait 30 minutes before submitting another contact form.'
      });
    }
    
    // Get IP address and user agent for security tracking
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    // Create contact with security tracking
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress,
      userAgent
    });

    // Enhanced logging
    console.log('Contact form received:', name, email);
    console.log('Contact saved to MongoDB:', contact._id);
    console.log('Security info - IP:', ipAddress, 'User Agent:', userAgent.substring(0, 50));
    console.log('Saved data:', {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      createdAt: contact.createdAt
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    
    // Handle validation errors from enhanced Contact model
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors[0] // Send first error to match frontend expectation
      });
    }

    // Handle duplicate key errors (if you add unique constraints later)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A contact form with this email was already submitted recently.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error saving contact form. Please try again.'
    });
  }
};

// Get all contacts (admin only)
export const getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-ipAddress -userAgent'); // Hide sensitive security data from admin view

    const total = await Contact.countDocuments();

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching contacts'
    });
  }
};

// Get single contact (admin only)
export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching contact'
    });
  }
};

// Update contact status (admin only)
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating contact'
    });
  }
};

// Delete contact (admin only)
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting contact'
    });
  }
};

// Get contact statistics (admin only)
export const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalContacts = await Contact.countDocuments();
    const todayContacts = await Contact.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalContacts,
        today: todayContacts,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching statistics'
    });
  }
};

// Search contacts (admin only)
export const searchContacts = async (req, res) => {
  try {
    const { q, status } = req.query;
    const query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-ipAddress -userAgent'); // Hide sensitive data

    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Search contacts error:', error);
    res.status(500).json({
      success: false,
      error: 'Error searching contacts'
    });
  }
};