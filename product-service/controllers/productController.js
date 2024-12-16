const { Product, ProductImage, Category } = require('../models/productModel'); // Ensure Category is imported
const { BASE_URL } = require('../config/config'); // Ensure BASE_URL is defined in your config
const { Op } = require('sequelize'); // Import Op from sequelize for query operations

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ include: [ProductImage, Category] }); // Include Category in the query
        const detailedProducts = products.map(product => {
            const productData = product.toJSON();
            productData.images = productData.ProductImages.map(image => ({
                ...image,
                ImageURL: `${BASE_URL}/${image.ImageURL}`
            }));
            productData.category = productData.Category; // Include Category details
            return productData;
        });
        res.json(detailedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    const { ProductName, Description, Price, Stock, CategoryID, isSpecial, Specifications, Condition, Preorder, Variations, ShippingInsurance, Weight, Dimensions } = req.body;
    const SellerID = req.user.id; // Automatically set SellerID based on logged-in user
    try {
        const newProduct = await Product.create({ SellerID, ProductName, Description, Price, Stock, CategoryID, isSpecial, Specifications, Condition, Preorder, Variations, ShippingInsurance, Weight, Dimensions });
        if (req.files) {
            const images = req.files.map(file => ({ ProductID: newProduct.ProductID, ImageURL: file.path }));
            await ProductImage.bulkCreate(images);
        }
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { SellerID, ProductName, Description, Price, Stock, CategoryID, isSpecial } = req.body;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({ SellerID, ProductName, Description, Price, Stock, CategoryID, isSpecial });
        if (req.files) {
            await ProductImage.destroy({ where: { ProductID: id } });
            const images = req.files.map(file => ({ ProductID: id, ImageURL: file.path }));
            await ProductImage.bulkCreate(images);
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    const { productID, sellerID } = req.query;

    try {
        if (!productID && !sellerID) {
            return res.status(400).json({ message: 'ProductID or SellerID must be provided' });
        }

        const whereClause = {};
        if (productID) {
            whereClause.ProductID = productID;
        }
        if (sellerID) {
            whereClause.SellerID = sellerID;
        }

        const products = await Product.findAll({ where: whereClause });
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.destroy({ where: whereClause });
        res.json({ message: 'Product(s) deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

// Search products
exports.searchProducts = async (req, res) => {
    const { query, minPrice, maxPrice, productID, sellerID, categoryID, sortByPrice, isSpecial } = req.query;
    const whereClause = {};

    if (query) {
        whereClause.ProductName = { [Op.like]: `%${query}%` };
    }
    if (minPrice) {
        whereClause.Price = { ...whereClause.Price, [Op.gte]: minPrice };
    }
    if (maxPrice) {
        whereClause.Price = { ...whereClause.Price, [Op.lte]: maxPrice };
    }
    if (productID) {
        whereClause.ProductID = productID;
    }
    if (sellerID) {
        whereClause.SellerID = sellerID;
    }
    if (categoryID) {
        whereClause.CategoryID = categoryID;
    }
    if (isSpecial !== undefined) {
        whereClause.isSpecial = isSpecial === 'true';
    }

    const orderClause = [];
    if (sortByPrice) {
        orderClause.push(['Price', sortByPrice === 'highest' ? 'DESC' : 'ASC']);
    }

    try {
        const products = await Product.findAll({
            where: whereClause,
            include: [ProductImage, Category],
            order: orderClause
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        const detailedProducts = products.map(product => {
            const productData = product.toJSON();
            productData.images = productData.ProductImages.map(image => ({
                ...image,
                ImageURL: `${BASE_URL}/${image.ImageURL}`
            }));
            productData.category = productData.Category; // Include Category details
            return productData;
        });
        res.json(detailedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error searching products', error: error.message });
    }
};
