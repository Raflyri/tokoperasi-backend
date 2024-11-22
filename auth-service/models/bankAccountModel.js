const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const BankAccount = sequelize.define('BankAccount', {
    BankAccountID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'UserID'
        }
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    accountHolderName: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
});

BankAccount.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(BankAccount, { foreignKey: 'UserID' });

module.exports = BankAccount;