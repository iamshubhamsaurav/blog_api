const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxLength: [20, 'Title cannot be more than 20 characters'],
    unique: true,
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'Please add a description'],
    minLength: [300, 'Body must me more than 300 characters'],
  },
  slug: String,
  createdAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a category to the blog'],
  },
});

// blogSchema.pre('init', function (next) {
//   this.createdAt = Date.now();
//   next();
// });

blogSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
