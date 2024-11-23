const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Identity = sequelize.define('Identity', {
    IdentityID: {
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
    ktpNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ktpName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ktpBirthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    ktpAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    ktpPhoto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    selfieWithKtp: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
});

Identity.belongsTo(User, { foreignKey: 'UserID' });
User.hasOne(Identity, { foreignKey: 'UserID' });

module.exports = Identity;