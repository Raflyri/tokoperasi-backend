const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisementController');
const authenticate = require('../middleware/authenticate'); // Pastikan middleware autentikasi diimpor
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/advertisements'); // Tentukan folder penyimpanan
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

// Get all advertisements
router.get('/', advertisementController.getAdvertisements);

// Get advertisement by ID
router.get('/:id', advertisementController.getAdvertisementById);

// Create a new advertisement
router.post('/', authenticate, upload.single('ImageURL'), advertisementController.addAdvertisement);

// Update an advertisement
router.put('/:id', authenticate, upload.single('ImageURL'), advertisementController.updateAdvertisement);

// Delete an advertisement
router.delete('/:id', authenticate, advertisementController.deleteAdvertisement);

module.exports = router;