const Category = require('../models/Category');

// @route       : GET /api/v1/categories
// @desc        : Get all categories
// @access      : Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res
      .status(200)
      .json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Something went wrong!' });
  }
};

// @route       : GET /api/v1/categories/:id
// @desc        : Get a category
// @access      : Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with the id of ${category}`,
      });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Something went wrong!' });
  }
};

// @route       : POST /api/v1/categories
// @desc        : Create a category
// @access      : Private
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    console.log(category);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Something went wrong!' });
  }
};

// @route       : PUT /api/v1/categories:id
// @desc        : Update a category
// @access      : Private
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({
        succesS: false,
        message: `Category not found with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Something went wrong!' });
  }
};

// @route       : DELETE /api/v1/categories:id
// @desc        : Delete a category
// @access      : Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        succesS: false,
        message: `Category not found with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Something went wrong!' });
  }
};
