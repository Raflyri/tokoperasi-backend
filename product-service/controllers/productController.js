const { Product, Category, ProductImage } = require('../models/productModel');
const { Op } = require('sequelize');

// Get all products with optional filtering by SellerID or ProductID
exports.getProducts = async (req, res) => {
    const { SellerID, ProductID } = req.query;
    const whereClause = {};

    if (SellerID) {
        whereClause.SellerID = SellerID;
    }

    if (ProductID) {
        whereClause.ProductID = ProductID;
    }

    try {
        const products = await Product.findAll({
            where: whereClause,
            include: [
                { model: Category, attributes: ['CategoryName'] },
                { model: ProductImage, attributes: ['ImageURL'] }
            ]
        });
        // Add image URLs to the response
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
    const { ProductName, Description, Price, Stock, CategoryID, Specifications, Condition, Preorder, Variations, ShippingInsurance, Weight, Dimensions, isSpecial } = req.body;
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
            Dimensions,
            isSpecial // Tambahkan field isSpecial
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
    const { query, categoryID, ProductID, SellerID, minPrice, maxPrice, isSpecial } = req.query;

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

    // Filter by ID Product
    if (ProductID) {
        whereClause.ProductID = ProductID;
    }

    // Filter by ID Seller
    if (SellerID) {
        whereClause.SellerID = SellerID;
    }

    // Filter by price range
    if (minPrice && maxPrice) {
        whereClause.Price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice) {
        whereClause.Price = { [Op.gte]: minPrice };
    } else if (maxPrice) {
        whereClause.Price = { [Op.lte]: maxPrice };
    }

    // Filter by isSpecial
    if (isSpecial !== undefined) {
        whereClause.isSpecial = isSpecial === 'true';
    }

    try {
        // Execute search with filters and include category, images, and user details
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

// Search for products by category
exports.searchProductsByCategory = async (req, res) => {
    const { categoryID } = req.params;

    try {
        // Execute search with category filter and include category and images
        const products = await Product.findAll({
            where: { CategoryID: categoryID },
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
        res.status(500).json({ message: 'Error searching products by category', error: error.message });
    }
};

// Get product details by ID
exports.getProductDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id, {
            include: [
                { model: Category, attributes: ['CategoryName'] },
                { model: ProductImage, attributes: ['ImageURL'] }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productImages = product.ProductImages.map(image => ({
            ...image.toJSON(),
            ImageURL: `${req.protocol}://${req.get('host')}/${image.ImageURL}`
        }));

        const productDetails = {
            ...product.toJSON(),
            ProductImages: productImages
        };

        res.json(productDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product details', error: error.message });
    }
};