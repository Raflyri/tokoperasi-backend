const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const db = require('../config/database');
require('dotenv').config(); // Untuk mengambil variabel dari .env file

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        // Cek apakah user ada dan password benar
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, email: user.email }, 
                process.env.SECRET_KEY || 'default_secret_key', // SECRET_KEY diambil dari .env
                { expiresIn: '1h' } // Token kedaluwarsa dalam 1 jam
            );
            return res.json({ token });
        }
        
        // Jika email atau password salah
        return res.status(401).json({ message: 'Email atau password salah' });
    } catch (error) {
        // Jika terjadi error lainnya
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Hash password sebelum menyimpan
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({ email, username, password: hashedPassword });
        
        // Kembalikan user baru tanpa password
        return res.status(201).json({ 
            id: newUser.id, 
            email: newUser.email, 
            username: newUser.username 
        });
    } catch (error) {
        // Jika terjadi error saat pendaftaran
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
