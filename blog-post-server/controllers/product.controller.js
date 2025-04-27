// controllers/productController.js
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const dotenv = require('dotenv');

dotenv.config(); // En üstte olmalı!

const getProducts = async (payload) => {
  try {
    // Build query object from payload
    const { id, name, category } = payload || {};
    const query = {
      ...(id && { _id: id }),
      ...(name && { name: new RegExp(name, 'i') }),
      ...(category && { category }),
    };

    // Fetch products with necessary population
    const products = await Product.find(query)
      .populate({
        path: 'modules.productId',
        populate: { path: 'category' },
      })
      .populate('category');

    // Process products and modules
    const result = await Promise.all(
      products.map(async (product) => {
        return {
          _id: product._id,
          name: product.name,
          documentUrl: product.documentUrl,
          category: product.category,
        };
      }),
    );

    return result;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw new Error('Failed to fetch products');
  }
};

// Tüm ürünleri listeleme
exports.getAllProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProducts({ id });
    if (product?.length) {
      res.status(201).json(product[0]);
    } else {
      res.status(404).json({ message: 'Ürün bulunamadı' });
    }
  } catch (error) {
    console.error('Error fetching product(s):', error);
    throw new Error('Failed to fetch product(s). Please try again.');
  }
};

// API endpoint to get filtered products by name
exports.filterProducts = async (req, res) => {
  try {
    // Get the 'name' query parameter from the request
    const { name, category } = req.body;

    // Call getProducts with the name filter
    const products = await getProducts({ name: name, category: category });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni ürün ekleme
exports.createProduct = async (req, res) => {
  try {

    const {
      name,
      documentUrl,
      category,
    } = req.body;

    // Validate category existence
    const categoryExists = await mongoose.model('Category').findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const product = new Product({
      name,
      documentUrl,
      category,
    });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ürün güncelleme
exports.updateProduct = async (req, res) => {
  const { id } = req.params; // Get product ID from the route parameter
  const {
    name,
    documentUrl,
    category,
  } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    // Update the product fields
    product.name = name ?? product.name;
    product.documentUrl = documentUrl ?? product.documentUrl;
    product.category = category ?? product.category;

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ürün silme
exports.deleteProduct = async (req, res) => {
  try {
    // Ürünü bulma
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    // Burada silme işlemini gerçekleştirebilirsiniz
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Ürün silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
