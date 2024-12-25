const UserAddress = require('../models/addressModel');
const { Op } = require('sequelize');

// Get all addresses
exports.getAddresses = async (req, res) => {
    try {
        const addresses = await UserAddress.findAll();
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
};

// Search address by various fields
exports.searchAddress = async (req, res) => {
    try {
        const { addressID, userID, IsDefault, AddressLine, City, Province, PostalCode, LabelAddress, RecipientName, RecipientPhone } = req.query;
        const whereClause = {};
        if (addressID) whereClause.AddressID = addressID;
        if (userID) whereClause.UserID = userID;
        if (IsDefault) whereClause.IsDefault = IsDefault;
        if (AddressLine) whereClause.AddressLine1 = { [Op.like]: `%${AddressLine}%` };
        if (City) whereClause.City = { [Op.like]: `%${City}%` };
        if (Province) whereClause.Province = { [Op.like]: `%${Province}%` };
        if (PostalCode) whereClause.PostalCode = { [Op.like]: `%${PostalCode}%` };
        if (LabelAddress) whereClause.LabelAddress = { [Op.like]: `%${LabelAddress}%` };
        if (RecipientName) whereClause.RecipientName = { [Op.like]: `%${RecipientName}%` };
        if (RecipientPhone) whereClause.RecipientPhone = { [Op.like]: `%${RecipientPhone}%` };

        const addresses = await UserAddress.findAll({ where: whereClause });
        if (addresses.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Addresses fetched successfully', addresses });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};

// Get addresses by user token and addressID
exports.getAddressesByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressID } = req.query;
        const whereClause = { UserID: userId };
        if (addressID) whereClause.AddressID = addressID;

        const addresses = await UserAddress.findAll({ where: whereClause });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user addresses' });
    }
};

// Get address details by user token
exports.getAddressDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await UserAddress.findAll({ where: { UserID: userId } });
        if (addresses.length === 0) {
            return res.status(404).json({ message: 'Addresses not found' });
        }
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch address details' });
    }
};

// Create a new address
exports.addAddress = async (req, res) => {
    try {
        const { 
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
        } = req.body;
        const userId = req.user.id;

        let statusCode = 200; // Default status code
        let responseMessage = 'Address added successfully'; // Default message

        // Check if IsDefault is set to true (1)
        if (IsDefault) {
            // Find any existing default address for the user
            const existingDefaultAddress = await UserAddress.findOne({
                where: { UserID: userId, IsDefault: true }
            });

            // If an existing default address is found, update it to IsDefault = false
            if (existingDefaultAddress) {
                await existingDefaultAddress.update({ IsDefault: false });
                statusCode = 201; // Change status code to 201 for IsDefault change
                responseMessage = 'Address added, previous default address updated'; // Custom message
            }
        }

        // Create the new address
        const newAddress = await UserAddress.create({ 
            UserID: userId, 
            AddressLine1, 
            AddressLine2, 
            City, 
            Province, 
            PostalCode, 
            IsDefault: IsDefault || false, // Ensure IsDefault defaults to false
            LabelAddress,
            RecipientName,
            RecipientPhone,
            Latitude,
            Longitude
        });

        res.status(statusCode).json({ message: responseMessage, newAddress });
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
        const userId = req.user.id;
        const address = await UserAddress.findOne({ where: { AddressID: id, UserID: userId } });
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