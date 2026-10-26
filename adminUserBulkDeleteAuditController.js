import {
  bulkDeleteUsers
} from '../services/adminUserBulkDeleteService.js';

export async function bulkDeleteAuditController(req, res) {
  try {
    const { userIds } = req.body || {};
    const adminId = req.user?.id || req.user?.telegramId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication is required.'
      });
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one user ID.'
      });
    }

    const result = await bulkDeleteUsers(
      userIds,
      String(adminId)
    );

    return res.status(200).json({
      success: true,
      message: 'Bulk delete and audit processing completed.',
      data: result
    });
  } catch (error) {
    console.error(
      'Bulk delete audit controller error:',
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message || 'Bulk delete failed.'
    });
  }
}