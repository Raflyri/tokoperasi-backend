const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Payment;