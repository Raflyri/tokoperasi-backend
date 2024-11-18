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

exports.getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json(payment);
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

exports.updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderId, amount, paymentMethod, status } = req.body;

        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.orderId = orderId || payment.orderId;
        payment.amount = amount || payment.amount;
        payment.paymentMethod = paymentMethod || payment.paymentMethod;
        payment.status = status || payment.status;

        await payment.save();
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;

        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        await payment.destroy();
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};