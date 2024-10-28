const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, deleteCartItem } = require('../controllers/cartController');

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);

module.exports = router;