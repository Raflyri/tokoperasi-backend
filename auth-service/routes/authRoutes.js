const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/profPic'); // Tentukan folder penyimpanan
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

// Middleware untuk mengubah ukuran gambar
const resizeImage = async (req, res, next) => {
    if (!req.file) return next();

    const filePath = req.file.path;
    const resizedFilePath = `uploads/images/profPic/resized-${req.file.filename}`;

    try {
        await sharp(filePath)
            .resize(300, 300) // Ubah ukuran gambar menjadi 300x300 piksel
            .toFile(resizedFilePath);

        // Ganti path file yang diunggah dengan path file yang telah diubah ukurannya
        req.file.path = resizedFilePath;
        next();
    } catch (error) {
        console.error('Error resizing image:', error);
        res.status(500).json({ message: 'Error resizing image', error: error.message });
    }
};

// Route untuk login
router.post('/login', userController.login);

// Route untuk register
router.post('/register', upload.single('profilePicture'), resizeImage, userController.register);

//Route untuk register seller
router.post('/register-seller', userController.registerSeller);

// Route untuk verifikasi OTP
router.post('/verify-otp', userController.verifyOTP);

// Route untuk mengirim ulang OTP
router.post('/resend-otp', userController.resendOTP);

// Route untuk update user (memerlukan autentikasi)
router.put('/update/:id', authenticate, upload.single('profilePicture'), resizeImage, userController.updateUser);

// Route untuk verifikasi user (hanya untuk admin)
router.put('/verify-user/:userId', authenticate, userController.verifyUser);

// Route untuk mendapatkan detail user beserta sesi loginnya
router.get('/user-details/:id', authenticate, userController.getUserDetails);

router.get('/user-details-v2/:id', userController.getUserDetails);

router.get('/users', userController.getAllUsers);

router.post('/logout', authenticate, userController.logout);

module.exports = router;
