const Order = require('../models/orderModel');

exports.getOrders = async (req, res) => {
    const orders = await Order.findAll({ where: { userId: req.user.id } });
    res.json(orders);
};

exports.createOrder = async (req, res) => {
    const { totalAmount, status } = req.body;
    const newOrder = await Order.create({ userId: req.user.id, totalAmount, status });
    res.status(201).json(newOrder);
};