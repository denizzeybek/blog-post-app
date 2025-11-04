// controllers/blogController.js
const mongoose = require('mongoose');
const Blog = require('../models/blog.model');
const dotenv = require('dotenv');

dotenv.config(); // En üstte olmalı!

const getBlogs = async (payload) => {
  try {
    // Build query object from payload
    const { id, name, category } = payload || {};
    const query = {
      ...(id && { _id: id }),
      ...(name && { name: new RegExp(name, 'i') }),
      ...(category && { category }),
    };
    // Fetch blogs with necessary population, sorted by newest first
    const blogs = await Blog.find(query).populate('category').sort({ createdAt: -1 });

    return blogs;
  } catch (error) {
    console.error('Error in getBlogs:', error);
    throw new Error('Failed to fetch blogs');
  }
};

// Tüm ürünleri listeleme
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await getBlogs();
    res.status(201).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await getBlogs({ id });
    if (blog?.length) {
      res.status(201).json(blog[0]);
    } else {
      res.status(404).json({ message: 'Ürün bulunamadı' });
    }
  } catch (error) {
    console.error('Error fetching blog(s):', error);
    throw new Error('Failed to fetch blog(s). Please try again.');
  }
};

// API endpoint to get filtered blogs by name
exports.filterBlogs = async (req, res) => {
  try {
    // Get the 'name' query parameter from the request
    const { name, category } = req.body;

    // Call getBlogs with the name filter
    const blogs = await getBlogs({ name, category });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni ürün ekleme
exports.createBlog = async (req, res) => {
  try {
    const { name, enName, documentUrl, enDocumentUrl, category } = req.body;

    // Validate category existence
    const categoryExists = await mongoose.model('Category').findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found1' });
    }

    const blog = new Blog({
      name,
      enName,
      documentUrl,
      enDocumentUrl,
      category,
    });
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ürün güncelleme
exports.updateBlog = async (req, res) => {
  const { id } = req.params; // Get blog ID from the route parameter
  const { name, enName, documentUrl, enDocumentUrl, category } = req.body;

  try {
    // Find the blog by ID
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    // Update the blog fields
    blog.name = name ?? blog.name;
    blog.enName = enName ?? blog.enName;
    blog.documentUrl = documentUrl ?? blog.documentUrl;
    blog.enDocumentUrl = enDocumentUrl ?? blog.enDocumentUrl;
    blog.category = category ?? blog.category;

    // Save the updated blog
    const updatedBlog = await blog.save();

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ürün silme
exports.deleteBlog = async (req, res) => {
  try {
    // Ürünü bulma
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    // Burada silme işlemini gerçekleştirebilirsiniz
    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: 'Ürün silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
