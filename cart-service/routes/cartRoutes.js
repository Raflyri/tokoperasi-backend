const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, deleteCartItem } = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, getCart);
router.post('/', authenticate, addToCart);
router.put('/:id', authenticate, updateCartItem);
router.delete('/:id', authenticate, deleteCartItem);

module.exports = router;