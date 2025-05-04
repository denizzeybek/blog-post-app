const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  enCategoryName: {
    type: String,
    required: true,
  },
  categoryKey: {
    type: String,
    required: true,
  },
  categoryDetails: {
    type: String,
    default: '',
  },
  enCategoryDetails: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
