// routes/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');  // Ürün API rotalarını içe aktar
const blogRoutes = require('./blog.route');  // Ürün API rotalarını içe aktar
const categoryRoutes = require('./category.route');

// Ürün API'lerini yönlendir
router.use('/api/auth', authRoutes);
router.use('/api/blogs', blogRoutes);
router.use('/api/categories', categoryRoutes);

module.exports = router;
