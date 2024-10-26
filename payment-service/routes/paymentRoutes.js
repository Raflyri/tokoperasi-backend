const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middleware/authenticate');  // Import middleware autentikasi

router.get('/', authenticate, paymentController.getPayments);  // Gunakan middleware autentikasi
router.post('/', authenticate, paymentController.createPayment);  // Gunakan middleware autentikasi

module.exports = router;