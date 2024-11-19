'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'Specifications', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Products', 'Condition', {
      type: Sequelize.ENUM('new', 'used'),
      allowNull: false,
    });
    await queryInterface.addColumn('Products', 'Preorder', {
      type: Sequelize.ENUM('yes', 'no'),
      allowNull: false,
    });
    await queryInterface.addColumn('Products', 'Variations', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Products', 'ShippingInsurance', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Products', 'Weight', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.addColumn('Products', 'Dimensions', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'Specifications');
    await queryInterface.removeColumn('Products', 'Condition');
    await queryInterface.removeColumn('Products', 'Preorder');
    await queryInterface.removeColumn('Products', 'Variations');
    await queryInterface.removeColumn('Products', 'ShippingInsurance');
    await queryInterface.removeColumn('Products', 'Weight');
    await queryInterface.removeColumn('Products', 'Dimensions');
  }
};