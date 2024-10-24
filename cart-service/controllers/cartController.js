const Cart = require('../models/cartModel');

exports.getCart = async (req, res) => {
    const cartItems = await Cart.findAll({ where: { userId: req.user.id } });
    res.json(cartItems);
};

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const newCartItem = await Cart.create({ userId: req.user.id, productId, quantity });
    res.status(201).json(newCartItem);
};