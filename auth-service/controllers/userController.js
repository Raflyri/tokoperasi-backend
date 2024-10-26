const User = require('../models/userModel');
const Session = require('../models/sessionsModel');
const auditController = require('./auditController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role = 'buyer' } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            Username: username,
            Email: email,
            PasswordHash: hashedPassword,
            Role: role,
            IsVerified: false
        });

        // Log audit record for user registration
        await auditController.logCreateAction(newUser.UserID, username, newUser.secure_id, 'User created');

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.UserID, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //const expiresAt = Math.floor(Date.now() / 1000) + 3600; UNIX Set token expiration 1 hour from now
        const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');

        await Session.create({
            UserID: user.UserID,
            Token: token,
            CreatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
            ExpiresAt: expiresAt
        });

        res.json({ token });
    } catch (error) {
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
        await auditController.logUpdateAction(userId, req.user.username, req.user.secure_id, 'User updated');

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
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
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