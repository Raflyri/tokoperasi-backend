'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tambahkan kolom untuk menyimpan OTP dan otp_id
    await queryInterface.addColumn('AuditLogs', 'otp', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('AuditLogs', 'otp_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('AuditLogs', 'otpExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Ubah tipe kolom created_date, modified_date, dan deleted_at menjadi DATE
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
    // Hapus kolom yang ditambahkan
    await queryInterface.removeColumn('AuditLogs', 'otp');
    await queryInterface.removeColumn('AuditLogs', 'otp_id');
    await queryInterface.removeColumn('AuditLogs', 'otpExpiresAt');

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