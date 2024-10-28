const { Category } = require('../models/productModel');

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// Add a new category
exports.addCategory = async (req, res) => {
    const { CategoryName } = req.body;
    try {
        const newCategory = await Category.create({ CategoryName });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error adding category', error: error.message });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { CategoryName } = req.body;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.update({ CategoryName });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.destroy();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};

// Bulk add categories
exports.bulkAddCategories = async (req, res) => {
    const categories = req.body.categories; // Expecting an array of categories
    try {
        const newCategories = await Category.bulkCreate(categories);
        res.status(201).json(newCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error adding categories', error: error.message });
    }
};