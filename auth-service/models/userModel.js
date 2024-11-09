const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Session = require('./sessionsModel');

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
    deletedAt: {
        type: DataTypes.DATE,
    },    
}, {
    timestamps: true,
    paranoid: true,
    tableName: 'Users',
<<<<<<< HEAD
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
=======
    createdAt: 'created_at',
    updatedAt: 'updated_at',
>>>>>>> 95192612bce36d7f78911807e3fb1e0fb7576a06
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
<<<<<<< HEAD
=======

>>>>>>> 95192612bce36d7f78911807e3fb1e0fb7576a06
Session.belongsTo(User, { foreignKey: 'UserID' });

module.exports = User;
