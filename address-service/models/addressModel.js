const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAddress = sequelize.define('UserAddress', {
    AddressID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    AddressLine1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    AddressLine2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    City: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Province: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PostalCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    IsDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    LabelAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    RecipientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    RecipientPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

module.exports = UserAddress;