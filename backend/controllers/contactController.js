import Contact from '../models/Contact.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

//* Submit contact form 
export const submitContact = asyncHandler(async (req, res, next) => {
  console.log('Contact form received:', req.body.name, req.body.email);
  
  const { name, email, phone, subject, message } = req.body;

  try {
    //* create contact submission on fields
    const contact = await Contact.create({
      name,
      email,
      phone: phone || '', //* Handle optional phone field
      subject,
      message
    });

    console.log('Contact saved to MongoDB:', contact._id);
    console.log('Saved data:', { 
      id: contact._id, 
      name: contact.name, 
      email: contact.email,
      createdAt: contact.createdAt 
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Contact form submitted successfully. We will get back to you soon!'
    });

  } catch (dbError) {
    console.error('Database save error:', dbError);
    return next(new ErrorResponse('Database error occurred while saving contact', 500));
  }
});

//* get all contact submissions - Private (Admin only)
export const getAllContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

//* get single contact submission - Private (Admin only)
export const getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

//* update contact status - Private (Admin only)
export const updateContactStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact submission not found with id of ${req.params.id}`, 404));
  }

  if (status) contact.status = status;
  await contact.save();

  res.status(200).json({
    success: true,
    data: contact,
    message: 'Contact status updated successfully'
  });
});

//* delete contact submission - Private (Admin only)
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

//* search contact submissions - Private (Admin only)
export const searchContacts = asyncHandler(async (req, res, next) => {
  const { keyword, status } = req.query;

  let searchQuery = {};

  if (keyword) {
    searchQuery.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { email: { $regex: keyword, $options: 'i' } },
      { subject: { $regex: keyword, $options: 'i' } },
      { message: { $regex: keyword, $options: 'i' } }
    ];
  }

  if (status) searchQuery.status = status;

  const contacts = await Contact.find(searchQuery).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

//* get contact statistics - Private (Admin only)
export const getContactStats = asyncHandler(async (req, res, next) => {
  const statusStats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

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
      statusBreakdown: statusStats
    }
  });
});

//* test database read - Temporary (Development only)
export const testDatabaseRead = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find({}).limit(5).sort({ createdAt: -1 });
  
  console.log('Recent contacts in database:', contacts.length);
  contacts.forEach(contact => {
    console.log(`- ${contact.name} (${contact.email}) - ${contact.createdAt}`);
  });

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
    message: 'Database test completed successfully'
  });
});