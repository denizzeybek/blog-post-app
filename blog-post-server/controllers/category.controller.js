const Category = require('../models/category.model');
const Blog = require('../models/blog.model');

const getCategories = async (payload) => {
  try {
    // Build query object from payload
    const { id, categoryName, enCategoryName } = payload || {};
    const query = {
      ...(id && { _id: id }),
      ...(categoryName && { categoryName: new RegExp(categoryName, 'i') }),
      ...(enCategoryName && {
        enCategoryName: new RegExp(enCategoryName, 'i'),
      }),
    };

    return await Category.find(query);
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw new Error('Failed to fetch categories');
  }
};

// Tüm ürünleri listeleme
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(201).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await getCategories({ id });
    if (category?.length) {
      res.status(201).json(category[0]);
    } else {
      res.status(404).json({ message: 'Kategori bulunamadı' });
    }
  } catch (error) {
    console.error('Error fetching blog(s):', error);
    throw new Error('Failed to fetch blog(s). Please try again.');
  }
};

// Kategorileri filtreleme
exports.filterCategories = async (req, res) => {
  const { categoryName, enCategoryName } = req.body;
  try {
    // Call getBlogs with the name filter
    const categories = await getCategories({ categoryName, enCategoryName });
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Kategori filtreleme sırasında hata oluştu.', error });
  }
};

// Yeni kategori ekleme
exports.createCategory = async (req, res) => {
  const {
    categoryName,
    enCategoryName,
    categoryDetails,
    enCategoryDetails,
    iconName,
  } = req.body;

  try {
    const newCategory = new Category({
      categoryName,
      enCategoryName,
      categoryDetails,
      enCategoryDetails,
      iconName,
    });

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
  const {
    categoryName,
    enCategoryName,
    categoryDetails,
    enCategoryDetails,
    iconName,
  } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        categoryName,
        enCategoryName,
        categoryDetails,
        enCategoryDetails,
        iconName,
      },
      { new: true, runValidators: true },
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Kategori güncelleme hatası:", error);
    return res
      .status(400)
      .json({ message: 'Kategori güncellenirken hata oluştu.', error: error.message });
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
