const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

// Cart Routes
router.post('/create', authenticate, cartController.createCart);          
router.get('/get-cart', authenticate, cartController.getCartWithToken); //Ambil Cart Berdasarkan Token User        
router.get('/all-cart', authenticate, cartController.getAllCartsWithItems); // Get all carts with items
router.get('/user', authenticate, cartController.getCartByUser);


// Cart Item Routes
router.post('/add-item', authenticate, cartController.addItemToCart);
router.put('/item/:id', authenticate, cartController.updateCartItem);
router.delete('/item/:id', authenticate, cartController.deleteCartItem);
router.delete('/:id/clear', authenticate, cartController.clearCart);

module.exports = router;
