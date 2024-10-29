const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    OrderID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Referensi ke UserID dari Auth Service",
    },
    OrderStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'shipped', 'completed'),
        allowNull: false,
    },
    TotalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    ShippingAddressID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Referensi ke AddressID dari Address Service",
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
    tableName: 'Orders', // Sesuaikan dengan nama tabel di database
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
});

module.exports = Order;
