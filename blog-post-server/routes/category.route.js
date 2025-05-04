// routes/productRoutes.js

const express = require('express');
const {
  getAllCategories,
  filterCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} = require('../controllers/category.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Tüm ürünleri listeleme
router.get('/', getAllCategories);

// ürün detayı
router.get('/:id', getCategoryById);

// Ürünleri adıyla filtreleme
router.get('/filter', filterCategories);

// Yeni ürün ekleme
router.post('/', requireAuth, createCategory);

// Ürün güncelleme
router.put('/:id', requireAuth, updateCategory);

// Ürün silme
router.delete('/:id', requireAuth, deleteCategory);

module.exports = router;
