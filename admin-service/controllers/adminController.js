const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');  // Pastikan bcryptjs diimpor dengan benar

exports.getAdmins = async (req, res) => {
    const admins = await Admin.findAll();
    res.json(admins);
};

exports.addAdmin = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAdmin = await Admin.create({ username, password: hashedPassword });
    res.status(201).json(newAdmin);
};