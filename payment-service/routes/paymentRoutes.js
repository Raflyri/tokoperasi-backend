const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middleware/authenticate');  // Import middleware autentikasi

router.get('/', paymentController.getPayments);  // Gunakan middleware autentikasi
router.get('/:id', paymentController.getPaymentById);  // Gunakan middleware autentikasi
router.post('/', paymentController.createPayment);  // Gunakan middleware autentikasi
router.put('/:id', paymentController.updatePayment);  // Gunakan middleware autentikasi
router.delete('/:id', paymentController.deletePayment);  // Gunakan middleware autentikasi

module.exports = router;