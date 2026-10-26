import express from 'express';
import {
  getAdminUserActivity
} from '../services/adminUserActivityService.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/:telegramId/activity',
  requireMainAdmin,
  async (req, res) => {
    try {
      const result = await getAdminUserActivity({
        telegramId: req.params.telegramId
      });

      return res.status(200).json(result);
    } catch (error) {
      const message = error.message || '';

      const statusCode =
        message === 'User not found.'
          ? 404
          : message.includes('required')
            ? 400
            : 500;

      if (statusCode === 500) {
        console.error(
          'Admin user activity lookup failed:',
          error
        );
      }

      return res.status(statusCode).json({
        success: false,
        message:
          statusCode === 500
            ? 'Failed to retrieve user activity.'
            : message
      });
    }
  }
);

export default router;