const Payment = require('../models/paymentModel');

exports.getPayments = async (req, res) => {
    const payments = await Payment.findAll({ where: { userId: req.user.id } });
    res.json(payments);
};

exports.createPayment = async (req, res) => {
    const { orderId, amount, status } = req.body;
    const newPayment = await Payment.create({ userId: req.user.id, orderId, amount, status });
    res.status(201).json(newPayment);
};