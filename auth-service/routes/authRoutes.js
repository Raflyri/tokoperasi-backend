const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Route untuk login
router.post('/login', login);

// Route untuk register
router.post('/register', register);

module.exports = router;
