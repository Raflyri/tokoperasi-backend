const { Product, Category, ProductImage } = require('../models/productModel');
const { Op } = require('sequelize');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [Category, ProductImage]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Add a new product with optional images
exports.addProduct = async (req, res) => {
    const { ProductName, Description, Price, Stock, CategoryID, SellerID, Specifications, Condition, Preorder, Variations, ShippingInsurance, Weight, Dimensions } = req.body;
    try {
        const newProduct = await Product.create({
            ProductName,
            Description,
            Price,
            Stock,
            CategoryID,
            SellerID,
            Specifications,
            Condition,
            Preorder,
            Variations,
            ShippingInsurance,
            Weight,
            Dimensions
        });

        // If there are images, add them to ProductImages table
        if (req.files && req.files.length > 0) {
            const productImages = req.files.map(file => ({
                ProductID: newProduct.ProductID,
                ImageURL: file.path // Menyimpan path file yang diunggah
            }));
            await ProductImage.bulkCreate(productImages);
        }

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { ProductName, Description, Price, Stock, CategoryID, Specifications, Condition, Preorder, Variations, ShippingInsurance, Weight, Dimensions } = req.body;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({
            ProductName,
            Description,
            Price,
            Stock,
            CategoryID,
            Specifications,
            Condition,
            Preorder,
            Variations,
            ShippingInsurance,
            Weight,
            Dimensions
        });

        // If there are images, update them in ProductImages table
        if (req.files && req.files.length > 0) {
            await ProductImage.destroy({ where: { ProductID: id } });
            const productImages = req.files.map(file => ({
                ProductID: id,
                ImageURL: file.path // Menyimpan path file yang diunggah
            }));
            await ProductImage.bulkCreate(productImages);
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

// Search for products based on various criteria
exports.searchProducts = async (req, res) => {
    const { query, categoryID, minPrice, maxPrice } = req.query;

    // Build the where clause based on available filters
    const whereClause = {};

    // Search by product name or description
    if (query) {
        whereClause[Op.or] = [
            { ProductName: { [Op.like]: `%${query}%` } },
            { Description: { [Op.like]: `%${query}%` } }
        ];
    }

    // Filter by category
    if (categoryID) {
        whereClause.CategoryID = categoryID;
    }

    // Filter by price range
    if (minPrice && maxPrice) {
        whereClause.Price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice) {
        whereClause.Price = { [Op.gte]: minPrice };
    } else if (maxPrice) {
        whereClause.Price = { [Op.lte]: maxPrice };
    }

    try {
        // Execute search with filters and include category and images
        const products = await Product.findAll({
            where: whereClause,
            include: [
                { model: Category, attributes: ['CategoryName'] },
                { model: ProductImage, attributes: ['ImageURL'] }
            ]
        });

        // Tambahkan URL gambar ke dalam respons
        const productsWithImageURLs = products.map(product => {
            const productImages = product.ProductImages.map(image => ({
                ...image.toJSON(),
                ImageURL: `${req.protocol}://${req.get('host')}/${image.ImageURL}`
            }));
            return {
                ...product.toJSON(),
                ProductImages: productImages
            };
        });

        res.json(productsWithImageURLs);
    } catch (error) {
        res.status(500).json({ message: 'Error searching products', error: error.message });
    }
};