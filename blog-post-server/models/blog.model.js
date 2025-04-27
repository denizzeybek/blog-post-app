const mongoose = require('mongoose');

// Ürün şeması
const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  documentUrl: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Referencing the Category model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ürün modelini oluşturma
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
