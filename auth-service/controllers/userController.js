const { Sequelize } = require('sequelize');
const User = require('../models/userModel');
const Session = require('../models/sessionsModel');
const auditController = require('./auditController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role, phoneNumber, storeName, profilePicture } = req.body;
        console.log('Request Body:', req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        if (role === 'seller' && !storeName) {
            return res.status(400).json({ message: 'Store name is required for sellers' });
        }

        const newUser = await User.create({
            Username: username,
            Email: email,
            PasswordHash: hashedPassword,
            Role: role || 'buyer',
            IsVerified: false,
            phoneNumber,
            storeName: role === 'seller' ? storeName : null,
            profilePicture
        });

        // Log audit record for user registration
        await auditController.logCreateAction(newUser.UserID, username, newUser.secure_id, 'User created');

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, email, phoneNumber, password } = req.body;
        console.log('Request Body:', req.body);

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { Email: email },
                    { phoneNumber: phoneNumber },
                    { Username: username }
                ]
            }
        });

        if (!user) {
            console.log('User not found:', user);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User:', user.toJSON()); // Log user details
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.UserID, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Convert Unix timestamp to datetime string
        const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');

        // Save session to the database
        await Session.create({
            UserID: user.UserID,
            Token: token,
            ExpiresAt: expiresAt
        });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, email } = req.body;

        // Log before update
        console.log('Before Update:', user.toJSON());

        const updatedFields = {};
        if (username && username !== user.Username) {
            updatedFields.Username = { before: user.Username, after: username };
            user.Username = username;
        }
        if (email && email !== user.Email) {
            updatedFields.Email = { before: user.Email, after: email };
            user.Email = email;
        }

        await user.save();

        // Log after update
        console.log('After Update:', user.toJSON());

        // Log audit record for user update
        await auditController.logUpdateAction(
            userId,
            req.user.username,
            req.user.secure_id,
            {
                modified_by: req.user.username,
                modified_by_id: req.user.secure_id,
                modified_date: Math.floor(Date.now() / 1000),
                changes: updatedFields
            }
        );

        // Log request to file
        const logData = `Time: ${new Date().toISOString()}\nRequest: ${JSON.stringify(req.body)}\n\n`;
        fs.appendFileSync(path.join(__dirname, 'request.log'), logData);

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Register Seller
exports.registerSeller = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            Username: username,
            Email: email,
            PasswordHash: hashedPassword,
            Role: 'seller',
            IsVerified: false
        });
        res.status(201).json({ message: 'Seller registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering seller', error: error.message });
    }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            Username: username,
            Email: email,
            PasswordHash: hashedPassword,
            Role: 'admin',
            IsVerified: true
        });
        res.status(201).json({ message: 'Admin registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering admin', error: error.message });
    }
};

// Verifikasi User oleh Admin
exports.verifyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.IsVerified = true;
        await user.save();
        res.status(200).json({ message: 'User verified successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Soft delete the user
        user.deleted_at = Math.floor(Date.now() / 1000);
        await user.save();

        // Log audit record for user deletion
        await auditController.logDeleteAction(userId, req.user.username, req.user.secure_id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const { role, isVerified, isMember } = req.query;
        console.log('Query Params:', req.query);

        const filterConditions = {};
        if (role) filterConditions.Role = role;
        if (isVerified !== undefined) filterConditions.IsVerified = isVerified === 'true';
        if (isMember !== undefined) filterConditions.IsMember = isMember === 'true';

        const users = await User.findAll({ where: filterConditions });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.logout = async (req, res) => {
    const token = req.headers['authorization'];
    try {
        await Session.destroy({ where: { Token: token } });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error during logout', error: error.message });
    }
};

module.exports = {
    register: exports.register,
    updateUser: exports.updateUser,
    registerSeller: exports.registerSeller,
    registerAdmin: exports.registerAdmin,
    verifyUser: exports.verifyUser,
    deleteUser: exports.deleteUser,
    getAllUsers: exports.getAllUsers,
    logout: exports.logout,
    login
};