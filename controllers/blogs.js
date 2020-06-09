const Blog = require('../models/Blog');

// @route       : GET /api/v1/blogs
// @route       : GET /api/v1/categories/:categoryId/blogs
// @desc        : Get all blogs
// @access      : Public
exports.getBlogs = async (req, res, next) => {
  try {
    console.log(req.params.categoryId);
    if (req.params.categoryId) {
      const blogs = await Blog.find({ category: req.params.categoryId });
      res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } else {
      const blogs = await Blog.find();
      res.status(200).json({ success: true, count: blogs.length, data: blogs });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: 'Something went wrong!' });
  }
};

// @route       : GET /api/v1/blogs/:id
// @desc        : Get a blog
// @access      : Public
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        succes: false,
        message: `Blog not found with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Something went wrong!' });
  }
};

// @route       : POST /api/v1/categories/:categoryId/blogs
// @desc        : Create a blog
// @access      : Private
exports.createBlog = async (req, res, next) => {
  try {
    req.body.category = req.params.categoryId;
    const blog = await Blog.create(req.body);
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: 'Something went wrong!' });
  }
};

// @route       : PUT /api/v1/blogs/:id
// @desc        : Update a Blog
// @access      : Private
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      return res.status(404).json({
        succes: false,
        message: `Blog not found with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Something went wrong!' });
  }
};

// @route       : DELETE /api/v1/blogs/:id
// @desc        : Delete a Blog
// @access      : Private
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({
        succes: false,
        message: `Blog not found with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Something went wrong!' });
  }
};
