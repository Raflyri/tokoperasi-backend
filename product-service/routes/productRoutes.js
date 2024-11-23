const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

const { getProducts, addProduct, updateProduct, deleteProduct, searchProductsByCategory } = require('../controllers/productController');

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

// Middleware untuk melayani file statis di direktori uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Get all products
router.get('/', getProducts);

// Add a new product
router.post('/', upload.array('images', 5), addProduct); // Menggunakan upload.array untuk mengunggah banyak file

// Update a product
router.put('/:id', upload.array('images', 5), updateProduct); // Menggunakan upload.array untuk mengunggah banyak file

// Delete a product
router.delete('/:id', deleteProduct);

// Search products by category
router.get('/category/:categoryID', searchProductsByCategory);

router.get('/search', productController.searchProducts);

module.exports = router;