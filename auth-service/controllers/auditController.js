const AuditLog = require('../models/auditModel');

exports.logCreateAction = async (userId, createdBy, createdById, changes, otp, otp_id) => {
    await AuditLog.create({
        action: 'create',
        user_id: userId,
        created_by: createdBy,
        created_by_id: createdById,
        created_date: Math.floor(Date.now() / 1000),
        changes: JSON.stringify(changes), // Convert changes object to JSON string
        otp,
        otp_id
    });
};

exports.logUpdateAction = async (userId, modifiedBy, modifiedById, changes) => {
    await AuditLog.create({
        action: 'update',
        user_id: userId,
        modified_by: modifiedBy,
        modified_by_id: modifiedById,
        modified_date: Math.floor(Date.now() / 1000),
        changes: JSON.stringify(changes) // Convert changes object to JSON string
    });
};

exports.logDeleteAction = async (userId, deletedBy, deletedById) => {
    await AuditLog.create({
        action: 'delete',
        user_id: userId,
        deleted_by: deletedBy,
        deleted_by_id: deletedById,
        deleted_date: Math.floor(Date.now() / 1000)
    });
};
