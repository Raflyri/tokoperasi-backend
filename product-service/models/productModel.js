const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Ensure this line is correct

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
    timestamps: false
});

const Product = sequelize.define('Product', {
    ProductID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    SellerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Use the table name as a string
            key: 'UserID'
        }
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
            model: Category,
            key: 'CategoryID'
        }
    },
    isSpecial: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    Specifications: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Condition: {
        type: DataTypes.ENUM('new', 'used'),
        allowNull: false
    },
    Preorder: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false
    },
    Variations: {
        type: DataTypes.JSON,
        allowNull: true
    },
    ShippingInsurance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    Weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Dimensions: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
});

const ProductImage = sequelize.define('ProductImage', {
    ImageID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ProductID: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'ProductID'
        }
    },
    ImageURL: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: false
});

Product.belongsTo(Category, { foreignKey: 'CategoryID' });
Product.hasMany(ProductImage, { foreignKey: 'ProductID' });

module.exports = { Product, Category, ProductImage };
