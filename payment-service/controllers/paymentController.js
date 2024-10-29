const Payment = require('../models/paymentModel');

exports.getPayments = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const payments = await Payment.findAll({ where: { userId: req.user.id } });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPayment = async (req, res) => {
    try {
        const { orderId, amount, paymentMethod, userId } = req.body;

        const newPayment = await Payment.create({ orderId, amount, paymentMethod, userId, status: 'completed' });
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};