const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxLength: [20, 'Title cannot be more than 20 characters'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// categorySchema.pre('save', function () {
//   this.slug = slugify(this.title, { lower: true });
// });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
