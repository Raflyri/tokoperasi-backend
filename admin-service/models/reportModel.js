const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
    ReportID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Type: {
        type: DataTypes.ENUM('sales', 'inventory', 'user_activity'),
        allowNull: false
    },
    GeneratedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    FileURL: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Report;