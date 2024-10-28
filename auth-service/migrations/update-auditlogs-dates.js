'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Konversi nilai timestamp Unix ke format datetime
    await queryInterface.sequelize.query(`
      UPDATE AuditLogs
      SET created_date = FROM_UNIXTIME(created_date),
          modified_date = FROM_UNIXTIME(modified_date),
          deleted_at = FROM_UNIXTIME(deleted_at)
      WHERE created_date IS NOT NULL OR modified_date IS NOT NULL OR deleted_at IS NOT NULL;
    `);

    // Ubah tipe kolom menjadi DATE
    await queryInterface.changeColumn('AuditLogs', 'created_date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('AuditLogs', 'modified_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('AuditLogs', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Ubah tipe kolom kembali menjadi BIGINT
    await queryInterface.changeColumn('AuditLogs', 'created_date', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: () => Math.floor(Date.now() / 1000),
    });
    await queryInterface.changeColumn('AuditLogs', 'modified_date', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('AuditLogs', 'deleted_at', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
  }
};