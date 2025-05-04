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
  categoryDetails: {
    type: String,
    default: '',
  },
  enCategoryDetails: {
    type: String,
    default: '',
  },
  iconName: {
    type: String, // Örneğin: 'pi pi-home' veya 'fa fa-book'
    default: 'pi pi-user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
