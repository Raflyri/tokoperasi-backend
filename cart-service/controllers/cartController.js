const Cart = require('../models/cartModel');

exports.getCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({ where: { userId: req.user.id } });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items', error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const newCartItem = await Cart.create({ userId: req.user.id, productId, quantity });
        console.log(newCartItem);
        res.status(201).json(newCartItem);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const cartItem = await Cart.findOne({ where: { id, userId: req.user.id } });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item', error: error.message });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItem = await Cart.findOne({ where: { id, userId: req.user.id } });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartItem.destroy();
        res.json({ message: 'Cart item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting cart item', error: error.message });
    }
};