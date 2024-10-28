const AuditLog = require('../models/auditModel');

exports.logCreateAction = async (userId, createdBy, createdById, changes) => {
    await AuditLog.create({
        action: 'create',
        user_id: userId,
        created_by: createdBy,
        created_by_id: createdById,
        created_date: Math.floor(Date.now() / 1000),
        changes
    });
};

exports.logUpdateAction = async (userId, modifiedBy, modifiedById, changes) => {
    await AuditLog.create({
        action: 'update',
        user_id: userId,
        modified_by: modifiedBy,
        modified_by_id: modifiedById,
        modified_date: Math.floor(Date.now() / 1000),
        changes
    });
};

exports.logDeleteAction = async (userId, deletedBy, deletedById) => {
    await AuditLog.create({
        action: 'delete',
        user_id: userId,
        deleted_by: deletedBy,
        deleted_by_id: deletedById,
        deleted_at: Math.floor(Date.now() / 1000)
    });
};
