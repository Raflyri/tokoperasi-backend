'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tambahkan field baru pada tabel Users
    await queryInterface.addColumn('Users', 'storeDescription', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'storePhoto', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'nibNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'nibPhoto', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'storeAddress', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Buat tabel Identity
    await queryInterface.createTable('Identities', {
      IdentityID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'UserID'
        }
      },
      ktpNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ktpName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ktpBirthdate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      ktpAddress: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ktpPhoto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      selfieWithKtp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      CreatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      UpdatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });

    // Buat tabel BankAccount
    await queryInterface.createTable('BankAccounts', {
      BankAccountID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'UserID'
        }
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accountHolderName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      CreatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      UpdatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus field baru dari tabel Users
    await queryInterface.removeColumn('Users', 'storeDescription');
    await queryInterface.removeColumn('Users', 'storePhoto');
    await queryInterface.removeColumn('Users', 'nibNumber');
    await queryInterface.removeColumn('Users', 'nibPhoto');
    await queryInterface.removeColumn('Users', 'storeAddress');

    // Hapus tabel Identity
    await queryInterface.dropTable('Identities');

    // Hapus tabel BankAccount
    await queryInterface.dropTable('BankAccounts');
  }
};