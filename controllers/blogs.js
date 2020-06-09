const Blog = require('../models/Blog');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @route       : GET /api/v1/blogs
// @route       : GET /api/v1/categories/:categoryId/blogs
// @desc        : Get all blogs
// @access      : Public
exports.getBlogs = catchAsync(async (req, res, next) => {
  // console.log(req.params.categoryId);
  if (req.params.categoryId) {
    const blogs = await Blog.find({ category: req.params.categoryId });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } else {
    const blogs = await Blog.find();
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  }
});

// @route       : GET /api/v1/blogs/:id
// @desc        : Get a blog
// @access      : Public
exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(
      new AppError(`Blog not found with the Id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: blog });
});

// @route       : POST /api/v1/categories/:categoryId/blogs
// @desc        : Create a blog
// @access      : Private
exports.createBlog = catchAsync(async (req, res, next) => {
  req.body.category = req.params.categoryId;
  const blog = await Blog.create(req.body);
  res.status(200).json({ success: true, data: blog });
});

// @route       : PUT /api/v1/blogs/:id
// @desc        : Update a Blog
// @access      : Private
exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    return next(
      new AppError(`Blog not found with the Id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: blog });
});

// @route       : DELETE /api/v1/blogs/:id
// @desc        : Delete a Blog
// @access      : Private
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return next(
      new AppError(`Blog not found with the Id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
