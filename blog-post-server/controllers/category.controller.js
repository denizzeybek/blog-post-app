const Category = require('../models/category.model');
const Blog = require('../models/blog.model');

// Tüm kategorileri listeleme
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Kategori bilgileri alınırken hata oluştu.', error });
  }
};

// Kategorileri filtreleme
exports.filterCategories = async (req, res) => {
  const { name } = req.body; // Query parametreleri
  try {
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i'); // Case insensitive regex

    const categories = await Category.find(filter);
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Kategori filtreleme sırasında hata oluştu.', error });
  }
};

// Yeni kategori ekleme
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Kategori oluşturulurken hata oluştu.', error });
  }
};

// Kategori güncelleme
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Update related blogs' category name
    await Blog.updateMany(
      { category: id },
      { $set: { 'category.name': updatedCategory.name } }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category.', error });
  }
};

// Kategori silme
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Kategori bulunamadı.' });
    }

    res.status(200).json({ message: 'Kategori başarıyla silindi.' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Kategori silinirken hata oluştu.', error });
  }
};