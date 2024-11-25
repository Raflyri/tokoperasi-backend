'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserAddresses', 'LabelAddress', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('UserAddresses', 'RecipientName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('UserAddresses', 'RecipientPhone', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserAddresses', 'LabelAddress');
    await queryInterface.removeColumn('UserAddresses', 'RecipientName');
    await queryInterface.removeColumn('UserAddresses', 'RecipientPhone');
  }
};