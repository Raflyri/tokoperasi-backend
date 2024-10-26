const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Categories model
const Category = sequelize.define('Category', {
    CategoryID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CategoryName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false // Assuming no timestamps for categories
});

// Products model
const Product = sequelize.define('Product', {
    ProductID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    SellerID: {
        type: DataTypes.INTEGER, // Refers to SellerID, no foreign key constraint
        allowNull: false
    },
    ProductName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    Stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CategoryID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Categories',
            key: 'CategoryID'
        },
        allowNull: true
    },
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true
});

// Product Images model
const ProductImage = sequelize.define('ProductImage', {
    ImageID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ProductID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products',
            key: 'ProductID'
        },
        allowNull: false
    },
    ImageURL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true
});

// Relationships
Product.belongsTo(Category, { foreignKey: 'CategoryID' });
ProductImage.belongsTo(Product, { foreignKey: 'ProductID', onDelete: 'CASCADE' });

module.exports = { Category, Product, ProductImage };
