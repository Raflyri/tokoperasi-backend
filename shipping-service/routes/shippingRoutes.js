const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const authenticate = require('../middleware/authenticate');  // Pastikan jalur ini benar

router.get('/', shippingController.getShipping);  // Gunakan middleware autentikasi
router.get('/:id', shippingController.getShippingById);  // Gunakan middleware autentikasi
router.post('/', shippingController.createShipping);  // Gunakan middleware autentikasi
router.put('/:id', shippingController.updateShipping);  // Gunakan middleware autentikasi
router.delete('/:id', shippingController.deleteShipping);  // Gunakan middleware autentikasi

module.exports = router;