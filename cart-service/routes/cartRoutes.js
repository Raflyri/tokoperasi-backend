const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

// Cart Routes
router.post('/create', authenticate, cartController.createCart);          
router.get('/:id', authenticate, cartController.getCartById);         

// Cart Item Routes
router.post('/add-item', authenticate, cartController.addItemToCart);
router.put('/item/:id', authenticate, cartController.updateCartItem);
router.delete('/item/:id', authenticate, cartController.deleteCartItem);
router.delete('/:id/clear', authenticate, cartController.clearCart);

module.exports = router;
