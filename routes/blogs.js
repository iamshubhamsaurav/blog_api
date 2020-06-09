const express = require('express');
const blogsController = require('../controllers/blogs');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(blogsController.getBlogs)
  .post(blogsController.createBlog);

router
  .route('/:id')
  .get(blogsController.getBlog)
  .put(blogsController.updateBlog)
  .delete(blogsController.deleteBlog);

module.exports = router;
