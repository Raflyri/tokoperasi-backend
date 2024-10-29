const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');  // Pastikan jalur ini benar
const authenticate = require('../middleware/authenticate');  // Import middleware autentikasi

router.get('/', authenticate, orderController.getOrders);
router.post('/', authenticate, orderController.createOrder);
router.post('/from-cart', authenticate, orderController.createOrderFromCart);
router.put('/:id', authenticate, orderController.updateOrder);
router.delete('/:id', authenticate, orderController.deleteOrder);
router.put('/:id/status', authenticate, orderController.updateOrderStatus);
router.post('/:id/pay', authenticate, orderController.payOrder);

module.exports = router;
