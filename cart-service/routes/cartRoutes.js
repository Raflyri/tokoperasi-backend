const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

// Cart Routes
router.post('/create', cartController.createCart);          
router.get('/:id', cartController.getCartById);         

// Cart Item Routes
router.post('/add-item', cartController.addItemToCart);
router.put('/item/:id', cartController.updateCartItem);
router.delete('/item/:id', cartController.deleteCartItem);
router.delete('/:id/clear', cartController.clearCart);

module.exports = router;
