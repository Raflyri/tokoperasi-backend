const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const authenticate = require('../middleware/authenticate');  // Pastikan jalur ini benar

router.get('/', authenticate, shippingController.getShipping);  // Gunakan middleware autentikasi
router.get('/:id', authenticate, shippingController.getShippingById);  // Gunakan middleware autentikasi
router.post('/', authenticate, shippingController.createShipping);  // Gunakan middleware autentikasi
router.put('/:id', authenticate, shippingController.updateShipping);  // Gunakan middleware autentikasi
router.delete('/:id', authenticate, shippingController.deleteShipping);  // Gunakan middleware autentikasi

module.exports = router;