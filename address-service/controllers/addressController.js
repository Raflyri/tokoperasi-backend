const UserAddress = require('../models/userAddressModel');

// Get all addresses
exports.getAddresses = async (req, res) => {
    try {
        const addresses = await UserAddress.findAll({ where: { UserID: req.user.id } });
        res.json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};

// Get address by ID
exports.getAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await UserAddress.findOne({ where: { AddressID: id, UserID: req.user.id } });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json(address);
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
};

// Create a new address
exports.addAddress = async (req, res) => {
    try {
        const { AddressLine1, AddressLine2, City, Province, PostalCode, IsDefault } = req.body;
        const newAddress = await UserAddress.create({ 
            UserID: req.user.id, 
            AddressLine1, 
            AddressLine2, 
            City, 
            Province, 
            PostalCode, 
            IsDefault 
        });
        res.status(201).json(newAddress);
    } catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({ message: 'Error creating address', error: error.message });
    }
};

// Update an address
exports.updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { AddressLine1, AddressLine2, City, Province, PostalCode, IsDefault } = req.body;
        const address = await UserAddress.findOne({ where: { AddressID: id, UserID: req.user.id } });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        address.AddressLine1 = AddressLine1;
        address.AddressLine2 = AddressLine2;
        address.City = City;
        address.Province = Province;
        address.PostalCode = PostalCode;
        address.IsDefault = IsDefault;
        await address.save();
        res.json(address);
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Error updating address', error: error.message });
    }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await UserAddress.findOne({ where: { AddressID: id, UserID: req.user.id } });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        await address.destroy();
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};