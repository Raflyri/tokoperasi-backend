const Shipping = require('../models/shippingModel');

exports.getShipping = async (req, res) => {
    try {
        const shipping = await Shipping.findAll({ where: { userId: req.user.id } });
        res.json(shipping);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getShippingById = async (req, res) => {
    try {
        const { id } = req.params;
        const shipping = await Shipping.findByPk(id);

        if (!shipping) {
            return res.status(404).json({ message: 'Shipping not found' });
        }

        res.json(shipping);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createShipping = async (req, res) => {
    try {
        const { orderId, trackingNumber, status } = req.body;
        const newShipping = await Shipping.create({ userId: req.user.id, orderId, trackingNumber, status });
        res.status(201).json(newShipping);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateShipping = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderId, trackingNumber, status } = req.body;

        const shipping = await Shipping.findByPk(id);
        if (!shipping) {
            return res.status(404).json({ message: 'Shipping not found' });
        }

        shipping.orderId = orderId || shipping.orderId;
        shipping.trackingNumber = trackingNumber || shipping.trackingNumber;
        shipping.status = status || shipping.status;

        await shipping.save();
        res.json(shipping);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteShipping = async (req, res) => {
    try {
        const { id } = req.params;

        const shipping = await Shipping.findByPk(id);
        if (!shipping) {
            return res.status(404).json({ message: 'Shipping not found' });
        }

        await shipping.destroy();
        res.json({ message: 'Shipping deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};