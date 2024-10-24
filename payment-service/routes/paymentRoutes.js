const express = require('express');
const router = express.Router();
const { getPayments, createPayment } = require('../controllers/paymentController');

router.get('/', getPayments);
router.post('/', createPayment);

module.exports = router;