const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const User = require('./userModel'); // Pastikan impor model User benar

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    action: {
        type: DataTypes.ENUM('create', 'update', 'delete', 'otp'),
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    secure_id: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
    },
    created_by: {
        type: DataTypes.STRING,
    },
    created_by_id: {
        type: DataTypes.STRING,
    },
    created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otp_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otpExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    modified_by: {
        type: DataTypes.STRING,
    },
    modified_by_id: {
        type: DataTypes.STRING,
    },
    modified_date: {
        type: DataTypes.DATE,
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
    deleted_by: {
        type: DataTypes.STRING,
    },
    deleted_by_id: {
        type: DataTypes.STRING,
    },
    changes: {
        type: DataTypes.TEXT,
    }
}, {
    timestamps: false,
    tableName: 'AuditLogs',
});


module.exports = AuditLog;
