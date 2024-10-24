const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gatewayController');  // Import controller

// Rute login yang diarahkan ke auth-service
router.post('/login', gatewayController.login);

// Rute produk yang diarahkan ke product-service
router.get('/products', gatewayController.getProducts);

module.exports = router;
