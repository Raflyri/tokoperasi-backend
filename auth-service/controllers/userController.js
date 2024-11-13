const { Sequelize } = require('sequelize');
const User = require('../models/userModel');
const Session = require('../models/sessionsModel');
const auditController = require('./auditController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { generateOTP } = require('../utils/otp');
const { sendOTP } = require('../utils/email');

exports.register = async (req, res) => {
    try {
        const { username, identifier, password, role, storeName } = req.body;
        console.log('Request Body:', req.body);

        // Validasi apakah identifier adalah email atau nomor telepon
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const isPhoneNumber = /^\d{10,15}$/.test(identifier);

        if (!isEmail && !isPhoneNumber) {
            return res.status(400).json({ message: 'Identifier must be a valid email or phone number' });
        }

        // Tentukan jalur gambar profil default
        const defaultProfilePicture = 'uploads/images/logo_only_white.png';

        // Gunakan gambar yang diunggah jika ada, jika tidak gunakan gambar default
        const profilePicture = req.file ? req.file.path : defaultProfilePicture;

        // Generate OTP
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        const newUser = await User.create({
            Username: username,
            Email: isEmail ? identifier : null,
            phoneNumber: isPhoneNumber ? identifier : null,
            PasswordHash: await bcrypt.hash(password, 10),
            Role: role || 'buyer',
            IsVerified: false,
            storeName: role === 'seller' ? storeName : null,
            profilePicture,
            otp,
            otpExpiresAt
        });

        // Send OTP to user's email
        if (isEmail) {
            await sendOTP(identifier, otp);
        }

        // Log audit record for user registration
        await auditController.logCreateAction(newUser.UserID, identifier, newUser.secure_id, 'User created');

        res.status(201).json({ message: 'User registered successfully. Please verify your email with the OTP sent.', user: newUser });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        console.log('Request Body:', req.body);

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { Email: identifier },
                    { phoneNumber: identifier }
                ]
            }
        });

        if (!user) {
            console.log('User not found:', user);
            return res.status(401).json({ message: 'User tidak ditemukan' });
        }

        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password yang dimasukkan salah' });
        }

        //Token Expired for 1 Month
        const token = jwt.sign({ id: user.UserID, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '30d' });
        const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');

        //No Expired Token
        //const token = jwt.sign({ id: user.UserID, email: user.Email }, process.env.JWT_SECRET);
        //const expiresAt = null;

        await Session.create({
            UserID: user.UserID,
            Token: token,
            ExpiresAt: expiresAt
        });

        console.log(
            'Login successful:', user.Username, 
            'ID User:', user.UserID, 
            'Token:', token, 
            'ExpUntill:', expiresAt
        );

        // Menampilkan informasi yang diinginkan dalam respon
        res.status(200).json({
            UserID: user.UserID,
            Username: user.Username,
            Email: user.Email,
            phoneNumber: user.phoneNumber,
            birthdate: user.Birthdate,
            gender: user.Gender,
            Role: user.Role,
            IsMember: user.IsMember,
            IsVerified: user.IsVerified,
            Token: token
        });
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

        const { username, email, gender, birthdate, isMember } = req.body;

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
        if (gender && gender !== user.Gender) {
            updatedFields.Gender = { before: user.Gender, after: gender };
            user.Gender = gender;
        }
        if (birthdate && birthdate !== user.Birthdate) {
            updatedFields.Birthdate = { before: user.Birthdate, after: birthdate };
            user.Birthdate = birthdate;
        }
        if (isMember !== undefined && isMember !== user.IsMember) {
            updatedFields.IsMember = { before: user.IsMember, after: isMember };
            user.IsMember = isMember;
        }

        if (req.file) {
            updatedFields.profilePicture = { before: user.profilePicture, after: req.file.path };
            user.profilePicture = req.file.path;
        }

        await user.save();

        console.log('After Update:', user.toJSON());

        await auditController.logUpdateAction(
            userId,
            req.user.username,
            req.user.secure_id,
            {
                modified_by: req.user.username,
                modified_by_id: req.user.secure_id,
                modified_date: Math.floor(Date.now() / 1000),
                changes: JSON.stringify(updatedFields)
            }
        );

        const logData = `Time: ${new Date().toISOString()}\nRequest: ${JSON.stringify(req.body)}\n\n`;
        fs.appendFileSync(path.join(__dirname, 'request.log'), logData);

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            include: [{
                model: Session,
                attributes: ['Token', 'CreatedAt', 'ExpiresAt']
            }]
        });

        

        if (!user) {
            return res.status(404).json({ message: 'Anda belum login, silahkan login dulu' });
        }

        res.status(200).json({ user });
        console.log(user);
    } catch (error) {
        console.error('Error retrieving user details:', error);
        res.status(500).json({ message: 'Error retrieving user details', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { username, id, role, isVerified, isMember } = req.query;
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

exports.verifyOTP = async (req, res) => {
    try {
        const { identifier, otp } = req.body;

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { Email: identifier },
                    { phoneNumber: identifier }
                ],
                otp,
                otpExpiresAt: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP or OTP has expired' });
        }

        user.IsVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.status(200).json({ message: 'User verified successfully', user });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.deleted_at = Math.floor(Date.now() / 1000);
        await user.save();

        await auditController.logDeleteAction(userId, req.user.username, req.user.secure_id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

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



module.exports = {
    register: exports.register,
    login: exports.login,
    updateUser: exports.updateUser,
    getUserDetails: exports.getUserDetails,
    getAllUsers: exports.getAllUsers,
    logout: exports.logout,
    verifyUser: exports.verifyUser,
    verifyOTP: exports.verifyOTP,
    deleteUser: exports.deleteUser,
    registerSeller: exports.registerSeller,
    registerAdmin: exports.registerAdmin
};
