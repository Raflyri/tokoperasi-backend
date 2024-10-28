const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/', categoryController.getCategories);

// Add a new category
router.post('/', categoryController.addCategory);

// Update a category
router.put('/:id', categoryController.updateCategory);

// Delete a category
router.delete('/:id', categoryController.deleteCategory);

// Bulk add categories
router.post('/bulk', categoryController.bulkAddCategories);

module.exports = router;