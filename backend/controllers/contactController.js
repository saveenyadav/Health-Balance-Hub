import Contact from '../models/Contact.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

//* Submit contact form - Public
export const submitContact = asyncHandler(async (req, res, next) => {
  const { name, email, phone, subject, message, category } = req.body;

  //* Create contact submission
  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message,
    category: category || 'general'
  });

  res.status(201).json({
    success: true,
    data: contact,
    message: 'Contact form submitted successfully. We will get back to you soon!'
  });
});

//* Get all contact submissions - Private (Admin only)
export const getAllContacts = asyncHandler(async (req, res, next) => {
  //* Build query for filtering
  let query = {};

  //* Add filters if provided
  if (req.query.status) query.status = req.query.status;
  if (req.query.category) query.category = req.query.category;
  if (req.query.priority) query.priority = req.query.priority;
  if (req.query.assignedTo) query.assignedTo = req.query.assignedTo;

  //* Execute query with population and sorting
  const contacts = await Contact.find(query)
    .populate('assignedTo', 'name email')
    .populate('response.respondedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

//* Get single contact submission - Private (Admin only)
export const getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('response.respondedBy', 'name email');

  if (!contact) {
    return next(new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

//* Update contact status - Private (Admin only)
export const updateContactStatus = asyncHandler(async (req, res, next) => {
  const { status, priority, assignedTo } = req.body;

  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404));
  }

  //* Update fields if provided
  if (status) contact.status = status;
  if (priority) contact.priority = priority;
  if (assignedTo) contact.assignedTo = assignedTo;

  await contact.save();

  //* Populate for response
  await contact.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'response.respondedBy', select: 'name email' }
  ]);

  res.status(200).json({
    success: true,
    data: contact,
    message: 'Contact status updated successfully'
  });
});

//* Respond to contact submission - Private (Admin only)
export const respondToContact = asyncHandler(async (req, res, next) => {
  const { responseMessage } = req.body;

  if (!responseMessage) {
    return next(new ErrorResponse('Please provide a response message', 400));
  }

  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404));
  }

  //* Add response
  contact.response = {
    message: responseMessage,
    respondedBy: req.user.id,
    respondedAt: new Date()
  };

  //* Update status to resolved if it's still new or in-progress
  if (contact.status === 'new' || contact.status === 'in-progress') {
    contact.status = 'resolved';
  }

  await contact.save();

  //* Populate for response
  await contact.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'response.respondedBy', select: 'name email' }
  ]);

  res.status(200).json({
    success: true,
    data: contact,
    message: 'Response added successfully'
  });
});

//* Delete contact submission - Private (Admin only)
export const deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404));
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Contact submission deleted successfully'
  });
});

//* Get contact statistics - Private (Admin only)
export const getContactStats = asyncHandler(async (req, res, next) => {
  //* Get counts by status
  const statusStats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  //* Get counts by category
  const categoryStats = await Contact.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  //* Get counts by priority
  const priorityStats = await Contact.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  //* Get total counts
  const totalContacts = await Contact.countDocuments();
  const newContacts = await Contact.countDocuments({ status: 'new' });
  const unresolvedContacts = await Contact.countDocuments({ 
    status: { $in: ['new', 'in-progress'] } 
  });

  res.status(200).json({
    success: true,
    data: {
      total: totalContacts,
      new: newContacts,
      unresolved: unresolvedContacts,
      statusBreakdown: statusStats,
      categoryBreakdown: categoryStats,
      priorityBreakdown: priorityStats
    }
  });
});

//* Search contact submissions - Private (Admin only)
export const searchContacts = asyncHandler(async (req, res, next) => {
  const { keyword, status, category, priority } = req.query;

  //* Build search query
  let searchQuery = {};

  //* Add text search if keyword provided
  if (keyword) {
    searchQuery.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { email: { $regex: keyword, $options: 'i' } },
      { subject: { $regex: keyword, $options: 'i' } },
      { message: { $regex: keyword, $options: 'i' } }
    ];
  }

  //* Add filters
  if (status) searchQuery.status = status;
  if (category) searchQuery.category = category;
  if (priority) searchQuery.priority = priority;

  const contacts = await Contact.find(searchQuery)
    .populate('assignedTo', 'name email')
    .populate('response.respondedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});