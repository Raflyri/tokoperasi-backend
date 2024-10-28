const Address = require('../models/addressModel');

exports.getAddresses = async (req, res) => {
    const addresses = await Address.findAll({ where: { userId: req.user.id } });
    res.json(addresses);
};

exports.addAddress = async (req, res) => {
    const { addressLine1, addressLine2, city, postalCode } = req.body;
    const newAddress = await Address.create({ userId: req.user.id, addressLine1, addressLine2, city, postalCode });
    res.status(201).json(newAddress);
};