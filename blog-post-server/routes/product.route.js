// routes/productRoutes.js

const express = require('express');

const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  filterProducts,
  updateProduct,
} = require('../controllers/product.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Tüm ürünleri listeleme
router.get('/', getAllProducts);

// ürün detayı
router.get('/:id', getProductById);

// Ürünleri adıyla filtreleme
router.post('/filter', filterProducts);

// Yeni ürün ekleme
router.post('/', requireAuth, createProduct);

// Ürün güncelleme
router.put('/:id', requireAuth, updateProduct);

// Ürün silme
router.delete('/:id', requireAuth, deleteProduct);

module.exports = router;
