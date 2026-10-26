import express from 'express';
import {
  bulkUpdateUserStatus
} from '../services/adminUserBulkService.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.patch(
  '/status',
  requireMainAdmin,
  async (req, res) => {
    try {
      const adminId =
        req.admin?.telegramId ??
        req.admin?.id ??
        req.user?.telegramId ??
        req.user?.id;

      const result = await bulkUpdateUserStatus({
        telegramIds: req.body?.telegramIds,
        status: req.body?.status,
        adminId
      });

      return res.status(200).json(result);
    } catch (error) {
      const message = error.message || '';

      const statusCode =
        message.includes('required') ||
        message.includes('maximum') ||
        message.includes('must be')
          ? 400
          : 500;

      if (statusCode === 500) {
        console.error(
          'Bulk user status update failed:',
          error
        );
      }

      return res.status(statusCode).json({
        success: false,
        message:
          statusCode === 500
            ? 'Failed to update user statuses.'
            : message
      });
    }
  }
);

export default router;