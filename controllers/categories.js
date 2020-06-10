const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @route       : GET /api/v1/categories
// @desc        : Get all categories
// @access      : Public
exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res
    .status(200)
    .json({ success: true, count: categories.length, data: categories });
});

// @route       : GET /api/v1/categories/:id
// @desc        : Get a category
// @access      : Public
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new AppError(`Category not found with the Id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: category });
});

// @route       : POST /api/v1/categories
// @desc        : Create a category
// @access      : Private
exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  // console.log(category);
  res.status(200).json({ success: true, data: category });
});

// @route       : PUT /api/v1/categories:id
// @desc        : Update a category
// @access      : Private
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(
      new AppError(`Category not found with the Id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: category });
});

// @route       : DELETE /api/v1/categories:id
// @desc        : Delete a category
// @access      : Private
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(
      new AppError(`Category not found with the Id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
