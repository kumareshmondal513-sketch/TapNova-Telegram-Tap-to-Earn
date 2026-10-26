import express from 'express';

import {
  getUserByTelegramId,
  getUsers,
  updateUserStatus
} from '../services/adminUserManagementService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const users = await getUsers({
        limit: req.query.limit,
        search: req.query.search
      });

      return res.status(200).json({
        success: true,
        count: users.length,
        users
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:telegramId',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const user = await getUserByTelegramId(
        req.params.telegramId
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      return res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:telegramId/status',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const { status } = req.body;

      const updatedBy =
        req.user?.telegramId ??
        req.telegramId;

      if (!updatedBy) {
        return res.status(401).json({
          success: false,
          message: 'Admin authentication required.'
        });
      }

      const result = await updateUserStatus(
        req.params.telegramId,
        status,
        updatedBy
      );

      return res.status(200).json(result);
    } catch (error) {
      if (
        error.message === 'Invalid user status.' ||
        error.message === 'User not found.' ||
        error.message === 'Telegram ID is required.'
      ) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }
);

export default router;