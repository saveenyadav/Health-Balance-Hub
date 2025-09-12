import Blog from '../models/Blog.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

//* Get all blog posts - Public
export const getBlogs = asyncHandler(async (req, res, next) => {
  //* Build query for filtering
  let query = { isPublished: true };

  //* Add category filter if provided
  if (req.query.category) {
    query.category = req.query.category;
  }

  //* Add author filter if provided
  if (req.query.author) {
    query.author = req.query.author;
  }

  //* Execute query with population and sorting
  const blogs = await Blog.find(query)
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .limit(parseInt(req.query.limit) || 10);

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

//* Get single blog post - Public
export const getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', 'name email');

  if (!blog) {
    return next(new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404));
  }

  //* Check if blog is published (unless user is author or admin)
  if (!blog.isPublished && (!req.user || (req.user.id !== blog.author._id.toString() && req.user.role !== 'admin'))) {
    return next(new ErrorResponse('Blog post not found', 404));
  }

  //* Increment view count
  blog.views = blog.views + 1;
  await blog.save();

  res.status(200).json({
    success: true,
    data: blog
  });
});

//* Create new blog post - Private (Admin/Instructor only)
export const createBlog = asyncHandler(async (req, res, next) => {
  //* Add author from logged in user
  req.body.author = req.user.id;

  //* Create blog post
  const blog = await Blog.create(req.body);

  //* Populate author details for response
  await blog.populate('author', 'name email');

  res.status(201).json({
    success: true,
    data: blog
  });
});

//* Update blog post - Private (Author/Admin only)
export const updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404));
  }

  //* Check ownership (author can only update their own posts)
  if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this blog post', 403));
  }

  //* Update blog post
  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('author', 'name email');

  res.status(200).json({
    success: true,
    data: blog
  });
});

//* Delete blog post - Private (Author/Admin only)
export const deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404));
  }

  //* Check ownership
  if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this blog post', 403));
  }

  await blog.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Blog post deleted successfully'
  });
});

//* Search blog posts - Public
export const searchBlogs = asyncHandler(async (req, res, next) => {
  const { keyword, category, author } = req.query;

  //* Build search query
  let searchQuery = { isPublished: true };

  //* Add text search if keyword provided
  if (keyword) {
    searchQuery.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { content: { $regex: keyword, $options: 'i' } },
      { tags: { $in: [new RegExp(keyword, 'i')] } }
    ];
  }

  //* Add filters
  if (category) searchQuery.category = category;
  if (author) searchQuery.author = author;

  const blogs = await Blog.find(searchQuery)
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

//* Get user's own blog posts - Private
export const getMyBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find({ author: req.user.id })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});