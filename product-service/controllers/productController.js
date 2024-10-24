const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
};

exports.addProduct = async (req, res) => {
    const { name, price, description } = req.body;
    const newProduct = await Product.create({ name, price, description });
    res.status(201).json(newProduct);
};