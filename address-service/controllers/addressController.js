const UserAddress = require('../models/addressModel');
const { Op } = require('sequelize');

// Get all addresses
exports.getAddresses = async (req, res) => {
    try {
        const { AddressLine1, AddressLine2, City, Province, PostalCode, IsDefault, LabelAddress, RecipientName, RecipientPhone } = req.query;
        const filter = { UserID: req.user.id };

        if (AddressLine1) filter.AddressLine1 = { [Op.like]: `%${AddressLine1}%` };
        if (AddressLine2) filter.AddressLine2 = { [Op.like]: `%${AddressLine2}%` };
        if (City) filter.City = { [Op.like]: `%${City}%` };
        if (Province) filter.Province = { [Op.like]: `%${Province}%` };
        if (PostalCode) filter.PostalCode = { [Op.like]: `%${PostalCode}%` };
        if (IsDefault !== undefined) filter.IsDefault = IsDefault === 'true';
        if (LabelAddress) filter.LabelAddress = { [Op.like]: `%${LabelAddress}%` };
        if (RecipientName) filter.RecipientName = { [Op.like]: `%${RecipientName}%` };
        if (RecipientPhone) filter.RecipientPhone = { [Op.like]: `%${RecipientPhone}%` };

        const addresses = await UserAddress.findAll({ where: filter });
        res.status(200).json({ message: 'Addresses fetched successfully', addresses });
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
        res.status(200).json({ message: 'Address fetched successfully', address });
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
};

// Create a new address
exports.addAddress = async (req, res) => {
    try {
        const { AddressLine1, AddressLine2, City, Province, PostalCode, IsDefault, LabelAddress, RecipientName, RecipientPhone, Latitude, Longitude } = req.body;
        const newAddress = await UserAddress.create({ 
            UserID: req.user.id, 
            AddressLine1, 
            AddressLine2, 
            City, 
            Province, 
            PostalCode, 
            IsDefault,
            LabelAddress,
            RecipientName,
            RecipientPhone,
            Latitude,
            Longitude
        });
        res.status(201).json({ message: 'Address created successfully', newAddress });
    } catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({ message: 'Error creating address', error: error.message });
    }
};

// Update an address
exports.updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { AddressLine1, AddressLine2, City, Province, PostalCode, IsDefault, LabelAddress, RecipientName, RecipientPhone, Latitude, Longitude } = req.body;
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
        address.LabelAddress = LabelAddress;
        address.RecipientName = RecipientName;
        address.RecipientPhone = RecipientPhone;
        address.Latitude = Latitude;
        address.Longitude = Longitude;
        await address.save();
        res.status(200).json({ message: 'Address updated successfully', address });
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
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};