import express from 'express';
import {
  updateAdminUserStatus
} from '../services/adminUserStatusService.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.patch(
  '/:telegramId/status',
  requireMainAdmin,
  async (req, res) => {
    try {
      const result = await updateAdminUserStatus({
        telegramId: req.params.telegramId,
        status: req.body?.status
      });

      return res.status(200).json(result);
    } catch (error) {
      const message = error.message || '';

      const statusCode =
        message === 'User not found.'
          ? 404
          : message.includes('required') ||
              message.includes('must be')
            ? 400
            : 500;

      if (statusCode === 500) {
        console.error(
          'Admin user status update failed:',
          error
        );
      }

      return res.status(statusCode).json({
        success: false,
        message:
          statusCode === 500
            ? 'Failed to update user status.'
            : message
      });
    }
  }
);

export default router;