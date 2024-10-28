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
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { orderId, amount, status } = req.body;
        const newPayment = await Payment.create({ userId: req.user.id, orderId, amount, status });
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};