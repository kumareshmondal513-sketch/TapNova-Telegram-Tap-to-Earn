import { bulkDeleteUsers } from '../services/adminUserBulkDeleteService.js';

export async function bulkDeleteUsersController(req, res) {
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

    const result = await bulkDeleteUsers(userIds, String(adminId));

    return res.status(200).json({
      success: true,
      message: 'Bulk user deletion processed.',
      data: result
    });
  } catch (error) {
    console.error('Bulk user deletion error:', error.message);

    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to delete users.'
    });
  }
}