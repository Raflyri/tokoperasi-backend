const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middleware/authenticate');  // Import middleware autentikasi

router.get('/', authenticate, paymentController.getPayments);  // Gunakan middleware autentikasi
router.get('/:id', authenticate, paymentController.getPaymentById);  // Gunakan middleware autentikasi
router.post('/', authenticate, paymentController.createPayment);  // Gunakan middleware autentikasi
router.put('/:id', authenticate, paymentController.updatePayment);  // Gunakan middleware autentikasi
router.delete('/:id', authenticate, paymentController.deletePayment);  // Gunakan middleware autentikasi

module.exports = router;