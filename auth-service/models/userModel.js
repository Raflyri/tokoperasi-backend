const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Session = require('./sessionsModel');
const AuditLog = require('./auditModel');

const User = sequelize.define('User', {
    UserID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    PasswordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Role: {
        type: DataTypes.ENUM('buyer', 'seller', 'admin'),
        allowNull: false,
    },
    Gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
    },
    Birthdate: {
        type: DataTypes.DATEONLY,
    },
    IsMember: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    IsVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    secure_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    storeName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ReferalNum: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    KoperasiName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    MemberNum: {
        type: DataTypes.STRING,
        allowNull: true,
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
    deletedAt: {
        type: DataTypes.DATE,
    }  
}, {
    timestamps: true,
    paranoid: true,
    tableName: 'Users',
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
});

User.beforeCreate(async (user) => {
    if (!user.secure_id) {
        user.secure_id = uuidv4();
    }
    if (user.password) {
        user.PasswordHash = await bcrypt.hash(user.PasswordHash, 10);
    }
});

User.hasMany(Session, { foreignKey: 'UserID' });
Session.belongsTo(User, { foreignKey: 'UserID' });


module.exports = User;
