'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'isSpecial', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'isSpecial');
  }
};