const { Sequelize } = require('sequelize');
const User = require('../models/userModel');
const Identity = require('../models/identityModel');
const BankAccount = require('../models/bankAccountModel');
const AuditLog = require('../models/auditModel');
const Session = require('../models/sessionsModel');
const auditController = require('./auditController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { generateOTPSMS, generateOTPEmail, validateOTP } = require('../utils/otp');
const axios = require('axios');

exports.register = async (req, res) => {
    try {
        const { username, email, phoneNumber, password, ReferalNum, KoperasiName, MemberNum, storeDescription, storePhoto, nibNumber, nibPhoto, storeAddress } = req.body;
        console.log('Request Body:', req.body);

        // Validasi apakah email atau nomor telepon sudah ada di database
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { Email: email },
                    { phoneNumber: phoneNumber }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email or Phone Number already exists. Please use a different email or phone number.' });
        }

        // Tentukan jalur gambar profil default
        const defaultProfilePicture = 'uploads/images/NoPhoto.jpg';

        // Gunakan gambar yang diunggah jika ada, jika tidak gunakan gambar default
        const profilePicture = req.file ? req.file.path : defaultProfilePicture;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat pengguna baru
        const newUser = await User.create({
            Username: username,
            Email: email,
            phoneNumber: phoneNumber,
            PasswordHash: hashedPassword,
            Role: 'buyer',
            IsVerified: false,
            ReferalNum: ReferalNum || null,
            KoperasiName: KoperasiName || null,
            MemberNum: MemberNum || null,
            profilePicture,
            storeDescription,
            storePhoto,
            nibNumber,
            nibPhoto,
            storeAddress
        });

        // Log audit record for user registration
        await auditController.logCreateAction(newUser.UserID, email, newUser.secure_id, 'User created');

        // Send registration success email via Email-Service
        try {
            await axios.post('http://email-service:3200/email/send-registration-success', { to: email });
            console.log(`Registration success email sent to ${email}`);
        } catch (emailError) {
            console.error(`Failed to send registration success email to ${email}: ${emailError.message}`);
        }

        res.status(201).json({ 
            message: 'User registered successfully.', 
            user: {
                ...newUser.toJSON(),
                profilePictureURL: `http://147.139.246.88:4000/${newUser.profilePicture}`
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.registerSeller = async (req, res) => {
    try {
        const { username, email, phoneNumber, password } = req.body;
        console.log('Request Body:', req.body);

        // Validasi apakah email atau nomor telepon sudah ada di database
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { Email: email },
                    { phoneNumber: phoneNumber }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email or Phone Number already exists. Please use a different email or phone number.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP using Fazpass
        const otpResponse = await generateOTPSMS(phoneNumber);
        const otp = otpResponse.data.otp;
        const otp_id = otpResponse.data.id;
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        // Buat pengguna baru
        const newUser = await User.create({
            Username: username,
            Email: email,
            phoneNumber: phoneNumber,
            PasswordHash: hashedPassword,
            Role: 'seller',
            IsVerified: false,
            otp,
            otp_id,
            otpExpiresAt
        });

        // Simpan OTP di tabel AuditLogs
        await AuditLog.create({
            action: 'otp',
            user_id: newUser.UserID,
            otp,
            otp_id,
            otpExpiresAt
        });

        // Log audit record for user registration
        await auditController.logCreateAction(newUser.UserID, email, newUser.secure_id, 'Seller created', otp, otp_id);

        res.status(201).json({ 
            message: 'Seller registered successfully. Please verify your phone with the OTP sent via WhatsApp.', 
            user: {
                ...newUser.toJSON(),
                profilePictureURL: `http://147.139.246.88:4000/${newUser.profilePicture}`
            },
            otp,
            otp_id
        });
    } catch (error) {
        console.error('Error during seller registration:', error);
        res.status(500).json({ message: 'Error registering seller', error: error.message });
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

        //Token Expired 1 Month
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

        // Send login success email via Email-Service
        try {
            await axios.post('http://email-service:3200/email/send-login-success', { to: user.Email });
            console.log(`Login success email sent to ${user.Email}`);
        } catch (emailError) {
            console.error(`Failed to send login success email to ${user.Email}: ${emailError.message}`);
        }

        // Panggil API endpoint untuk membuat keranjang
        try {
            const cartResponse = await axios.post('http://147.139.246.88:6000/api/cart/create', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Cart created successfully:', cartResponse.data);
        } catch (cartError) {
            console.error('Error creating cart:', cartError.response ? cartError.response.data : cartError.message);
        }

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
            profilePictureURL: `http://147.139.246.88:4000/${user.profilePicture}`,
            Token: token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token to get user info
        const userId = decoded.id; // Get user ID from the decoded token

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, email, phoneNumber, password, ReferalNum, KoperasiName, MemberNum, isMember, isVerified } = req.body;
        const updatedFields = {};

        if (username !== undefined && username !== user.Username) {
            updatedFields.Username = { before: user.Username, after: username };
            user.Username = username;
        }

        if (email !== undefined && email !== user.Email) {
            updatedFields.Email = { before: user.Email, after: email };
            user.Email = email;
        }

        if (phoneNumber !== undefined && phoneNumber !== user.phoneNumber) {
            updatedFields.phoneNumber = { before: user.phoneNumber, after: phoneNumber };
            user.phoneNumber = phoneNumber;
        }

        if (password !== undefined) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.PasswordHash = { before: user.PasswordHash, after: hashedPassword };
            user.PasswordHash = hashedPassword;
        }

        if (ReferalNum !== undefined && ReferalNum !== user.ReferalNum) {
            updatedFields.ReferalNum = { before: user.ReferalNum, after: ReferalNum };
            user.ReferalNum = ReferalNum;
        }

        if (KoperasiName !== undefined && KoperasiName !== user.KoperasiName) {
            updatedFields.KoperasiName = { before: user.KoperasiName, after: KoperasiName };
            user.KoperasiName = KoperasiName;
        }

        if (MemberNum !== undefined && MemberNum !== user.MemberNum) {
            updatedFields.MemberNum = { before: user.MemberNum, after: MemberNum };
            user.MemberNum = MemberNum;
        }

        if (isMember !== undefined && isMember !== user.IsMember) {
            updatedFields.IsMember = { before: user.IsMember, after: isMember };
            user.IsMember = isMember;
        }

        if (isVerified !== undefined && isVerified !== user.IsVerified) {
            updatedFields.IsVerified = { before: user.IsVerified, after: isVerified };
            user.IsVerified = isVerified;
        }

        if (req.file) {
            updatedFields.profilePicture = { before: user.profilePicture, after: req.file.path };
            user.profilePicture = req.file.path;
        }

        await user.save();

        console.log('After Update:', user.toJSON());

        await auditController.logUpdateAction(
            userId,
            user.Username,
            user.secure_id,
            {
                modified_by: user.Username,
                modified_by_id: user.secure_id,
                modified_date: Math.floor(Date.now() / 1000),
                changes: JSON.stringify(updatedFields)
            }
        );

        const logData = `Time: ${new Date().toISOString()}\nRequest: ${JSON.stringify(req.body)}\n\n`;
        fs.appendFileSync(path.join(__dirname, 'request.log'), logData);

        res.status(200).json({ 
            message: 'User updated successfully', 
            user: {
                ...user.toJSON(),
                profilePictureURL: `http://147.139.246.88:4000/${user.profilePicture}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { username, id, role, isVerified, isMember } = req.query;
        console.log('Query Params:', req.query);

        if (!username && !id && !role && isVerified === undefined && isMember === undefined) {
            console.error('Error: Request data is empty or missing');
            return res.status(400).json({ message: 'Request data is empty or missing' });
        }

        const filterConditions = {};
        if (role) filterConditions.Role = role;
        if (id) filterConditions.UserID = id;
        if (username) filterConditions.Username = { [Op.like]: `%${username}%` };
        if (isVerified !== undefined) filterConditions.IsVerified = isVerified === 'true';
        if (isMember !== undefined) filterConditions.IsMember = isMember === 'true';

        const users = await User.findAll({
            where: filterConditions,
            include: [{
                model: Session,
                attributes: ['Token', 'CreatedAt', 'ExpiresAt']
            }]
        });

        const usersWithProfilePictureURL = users.map(user => ({
            ...user.toJSON(),
            profilePictureURL: `http://147.139.246.88:4000/${user.profilePicture}`
        }));

        res.status(200).json(usersWithProfilePictureURL);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.logout = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    try {
        const session = await Session.findOne({ where: { Token: token } });
        if (!session) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        await Session.destroy({ where: { Token: token } });

        // Log the logout action in the audit table
        await auditController.logDeleteAction(session.UserID, req.user.username, req.user.secure_id);

        // Send logout success email via Email-Service
        try {
            await axios.post('http://email-service:3200/email/send-logout-success', { to: req.user.email });
            console.log(`Logout success email sent to ${req.user.email}`);
        } catch (emailError) {
            console.error(`Failed to send logout success email to ${req.user.email}: ${emailError.message}`);
        }

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
        const { otp_id, otp } = req.body;
        console.log('Request Body:', req.body);

         // Validate OTP using Fazpass
         const otpResponse = await validateOTP(otp_id, otp);
         if (!otpResponse.valid) {
             return res.status(400).json({ message: 'Invalid OTP or OTP has expired' });
         }

        res.status(200).json({ message: 'User verified successfully', user });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};

//Detail User berdasarkan token yang login
exports.getUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token to get user info
        const userId = decoded.id; // Get user ID from the decoded token

        const user = await User.findByPk(userId, {
            include: [{
                model: Session,
                attributes: ['Token', 'CreatedAt', 'ExpiresAt']
            }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            ...user.toJSON(),
            profilePictureURL: `http://147.139.246.88:4000/${user.profilePicture}`
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { identifier } = req.body;

        // Validasi apakah identifier adalah email atau nomor telepon
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const isPhoneNumber = /^(\+62|62|0)8\d{8,12}$/.test(identifier);

        if (!isEmail && !isPhoneNumber) {
            return res.status(400).json({ message: 'Identifier must be a valid email or phone number' });
        }

        // Cari pengguna berdasarkan identifier
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { Email: identifier },
                    { phoneNumber: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP using Fazpass
        let otpResponse;
        if (isPhoneNumber) {
            otpResponse = await generateOTPSMS(identifier);
        } else if (isEmail) {
            otpResponse = await generateOTPEmail(identifier);
        } else {
            otpResponse = { data: { id: null, otp: null } };
        }
        const otp = otpResponse.data.otp;
        const otp_id = otpResponse.data.id;
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        // Simpan OTP di tabel AuditLogs
        await AuditLog.create({
            action: 'otp',
            user_id: user.UserID,
            otp,
            otp_id,
            otpExpiresAt
        });

        res.status(200).json({ message: 'OTP resent successfully', user, otp, otp_id });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ message: 'Error resending OTP', error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { identifier } = req.body;

        // Validate if identifier is email or phone number
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const isPhoneNumber = /^(\+62|62|0)8\d{8,12}$/.test(identifier);

        if (!isEmail && !isPhoneNumber) {
            return res.status(400).json({ message: 'Identifier must be a valid email or phone number' });
        }

        // Find user based on identifier
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { Email: identifier },
                    { phoneNumber: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        // Generate a password reset token
        const resetToken = jwt.sign({ id: user.UserID, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //const resetURL = `https://apis.tokoperasi.co.id/api-auth/reset-password?token=${resetToken}`;
        const resetURL = `https://apis.tokoperasi.co.id/api-auth/verify-reset-token?token=${resetToken}`;

        // Send reset URL to user's email via Email-Service
        try {
            await axios.post('http://email-service:3200/email/send-reset-password', { to: user.Email, resetLink: resetURL });
            console.log(`Password reset email sent to ${user.Email}`);
        } catch (emailError) {
            console.error(`Failed to send password reset email to ${user.Email}: ${emailError.message}`);
        }

        res.status(200).json({ message: 'Password reset link sent successfully', resetURL });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Error during forgot password', error: error.message });
    }
};

// Endpoint GET untuk memverifikasi token dan mengarahkan pengguna ke halaman reset password
exports.verifyResetToken = async (req, res) => {
    try {
        const { token } = req.query; // Ambil token dari query parameter

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.redirect('https://sbox-web.tokoperasi.co.id/#/resetPasswordexpired');
        }

        // Jika token valid, arahkan pengguna ke halaman reset password
        res.redirect(`https://sbox-web.tokoperasi.co.id/#/updatePassword?token=${token}`);
    } catch (error) {
        console.error('Error verifying reset token:', error);
        res.redirect('https://sbox-web.tokoperasi.co.id/#/resetPasswordexpired');
    }
};

// Endpoint POST untuk mengubah password setelah pengguna memasukkan password baru
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body; // Ambil token dan password baru dari body

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.PasswordHash = hashedPassword;
        await user.save();

        // Send password reset confirmation email via Email-Service
        try {
            await axios.post('http://email-service:3200/email/send-reset-password-confirmation', { to: user.Email });
            console.log(`Password reset confirmation email sent to ${user.Email}`);
        } catch (emailError) {
            console.error(`Failed to send password reset confirmation email to ${user.Email}: ${emailError.message}`);
        }

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Error during password reset', error: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete related data
        await Identity.destroy({ where: { UserID: userId } });
        await Session.destroy({ where: { UserID: userId } });
        await AuditLog.destroy({ where: { user_id: userId } });

        // Delete user
        await user.destroy();

        // Log the deletion in the audit table
        const username = req.user ? req.user.username : 'system';
        const secure_id = req.user ? req.user.secure_id : 'system';
        await auditController.logDeleteAction(userId, username, secure_id);

        // Send account deletion email via Email-Service
        try {
            await axios.post('http://email-service:3200/email/send-account-deletion', { to: user.Email });
            console.log(`Account deletion email sent to ${user.Email}`);
        } catch (emailError) {
            console.error(`Failed to send account deletion email to ${user.Email}: ${emailError.message}`);
        }

        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Error deleting user account', error: error.message });
    }
};

module.exports = {
    register: exports.register,
    login: exports.login,
    updateUser: exports.updateUser,
    getUsers: exports.getUsers,
    logout: exports.logout,
    verifyUser: exports.verifyUser,
    verifyOTP: exports.verifyOTP,
    registerSeller: exports.registerSeller,
    resendOTP: exports.resendOTP,
    forgotPassword: exports.forgotPassword,
    resetPassword: exports.resetPassword,
    deleteAccount: exports.deleteAccount,
    getUserDetails: exports.getUserDetails,
    verifyResetToken: exports.verifyResetToken
};
