import express from 'express';
import {
  flagAdminUser,
  getAdminUserFlags
} from '../services/adminUserFlagService.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/:telegramId/flags',
  requireMainAdmin,
  async (req, res) => {
    try {
      const result = await getAdminUserFlags({
        telegramId: req.params.telegramId,
        limit: req.query.limit
      });

      return res.status(200).json(result);
    } catch (error) {
      const message = error.message || '';
      const statusCode = message.includes('required')
        ? 400
        : 500;

      if (statusCode === 500) {
        console.error(
          'Get user flags failed:',
          error
        );
      }

      return res.status(statusCode).json({
        success: false,
        message:
          statusCode === 500
            ? 'Failed to retrieve user flags.'
            : message
      });
    }
  }
);

router.post(
  '/:telegramId/flags',
  requireMainAdmin,
  async (req, res) => {
    try {
      const adminId =
        req.admin?.telegramId ??
        req.admin?.id ??
        req.user?.telegramId ??
        req.user?.id;

      const result = await flagAdminUser({
        telegramId: req.params.telegramId,
        reason: req.body?.reason,
        adminId
      });

      return res.status(201).json(result);
    } catch (error) {
      const message = error.message || '';

      const statusCode =
        message === 'User not found.'
          ? 404
          : message.includes('required') ||
              message.includes('cannot exceed')
            ? 400
            : 500;

      if (statusCode === 500) {
        console.error(
          'Create user flag failed:',
          error
        );
      }

      return res.status(statusCode).json({
        success: false,
        message:
          statusCode === 500
            ? 'Failed to create user flag.'
            : message
      });
    }
  }
);

export default router;