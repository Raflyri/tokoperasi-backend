const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100] // minimal 6 karakter
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }
}, {
    timestamps: true
});

// Hook untuk hashing password sebelum create dan update
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10); // Hashing password sebelum simpan
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10); // Hashing jika password berubah
    }
});

// Sync hanya jika dalam environment development
if (process.env.NODE_ENV === 'development') {
    sequelize.sync()
        .then(() => {
            console.log("Users table has been synced");
        })
        .catch((error) => {
            console.error("Unable to sync the Users table:", error);
        });
}

module.exports = User;
