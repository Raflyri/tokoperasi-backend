const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
    CartID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

const CartItem = sequelize.define('CartItem', {
    CartItemID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    CartID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: 'CartID'
        }
    },
    ProductID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Note: {
        type: DataTypes.TEXT,
    },
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

// Relasi Carts -> CartItems
Cart.hasMany(CartItem, { foreignKey: 'CartID', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'CartID' });

module.exports = { Cart, CartItem };
