// routes/blogRoutes.js
const express = require('express');

const {
  getAllBlogs,
  getBlogById,
  createBlog,
  deleteBlog,
  filterBlogs,
  updateBlog,
} = require('../controllers/blog.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Tüm ürünleri listeleme
router.get('/', getAllBlogs);

// ürün detayı
router.get('/:id', getBlogById);

// Ürünleri adıyla filtreleme
router.post('/filter', filterBlogs);

// Yeni ürün ekleme
router.post('/', requireAuth, createBlog);

// Ürün güncelleme
router.put('/:id', requireAuth, updateBlog);

// Ürün silme
router.delete('/:id', requireAuth, deleteBlog);

module.exports = router;
