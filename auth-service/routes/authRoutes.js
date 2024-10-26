const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

// Route untuk register seller
router.post('/register-seller', userController.registerSeller);

// Route untuk register admin
router.post('/register-admin', userController.registerAdmin);

// Route untuk login
router.post('/login', userController.login);

// Route untuk register
router.post('/register', userController.register);

// Route untuk update user (memerlukan autentikasi)
router.put('/update/:id', authenticate, userController.updateUser);

// Route untuk verifikasi user (hanya untuk admin)
router.put('/verify-user/:userId', authenticate, userController.verifyUser);

router.get('/users', userController.getAllUsers);

module.exports = router;
