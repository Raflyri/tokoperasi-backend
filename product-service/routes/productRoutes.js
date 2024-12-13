const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authenticate'); // Import the authenticate middleware

const { getProducts, addProduct, updateProduct, deleteProduct, searchProducts } = require('../controllers/productController'); // Ensure all functions are imported

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products'); // Tentukan folder penyimpanan
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filter file untuk memastikan hanya gambar yang diunggah
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Batas ukuran file 5MB
});

// Get all products
router.get('/', getProducts);

// Add a new product
router.post('/', authenticate, upload.array('images', 5), addProduct); // Use authenticate middleware

// Update a product
router.put('/:id', authenticate, upload.array('images', 5), updateProduct); // Use authenticate middleware

// Delete a product
router.delete('/', authenticate, deleteProduct); // Use authenticate middleware

// Search products
router.get('/search', searchProducts); // Add search route

module.exports = router;