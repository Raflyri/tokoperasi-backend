const Shipping = require('../models/shippingModel');

exports.getShipping = async (req, res) => {
    const shipping = await Shipping.findAll({ where: { userId: req.user.id } });
    res.json(shipping);
};

exports.createShipping = async (req, res) => {
    const { orderId, trackingNumber, status } = req.body;
    const newShipping = await Shipping.create({ userId: req.user.id, orderId, trackingNumber, status });
    res.status(201).json(newShipping);
};