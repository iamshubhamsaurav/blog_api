const blogRoute = require('../routes/blogs');
const express = require('express');

const categoriesController = require('../controllers/categories');

const router = express.Router();

//Include Other routes here
router.use('/:categoryId/blogs', blogRoute);

router
  .route('/')
  .get(categoriesController.getCategories)
  .post(categoriesController.createCategory);

router
  .route('/:id')
  .get(categoriesController.getCategory)
  .put(categoriesController.updateCategory)
  .delete(categoriesController.deleteCategory);

module.exports = router;
