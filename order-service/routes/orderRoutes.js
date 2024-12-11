const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');  // Pastikan jalur ini benar
const authenticate = require('../middleware/authenticate');  // Import middleware autentikasi

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);
router.post('/from-cart', orderController.createOrderFromCart);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.put('/:id/status', orderController.updateOrderStatus);
router.post('/:id/pay', orderController.payOrder);

module.exports = router;
