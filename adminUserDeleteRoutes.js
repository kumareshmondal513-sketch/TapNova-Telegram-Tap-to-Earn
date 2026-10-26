import express from 'express';

import {
  deleteUser,
  userExists
} from '../services/adminUserDeleteService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get(
  '/:telegramId/exists',
  async (req, res, next) => {
    try {
      const exists = await userExists(
        req.params.telegramId
      );

      return res.status(200).json({
        success: true,
        exists
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  '/:telegramId',
  async (req, res, next) => {
    try {
      const result = await deleteUser(
        req.params.telegramId
      );

      return res.status(200).json(result);
    } catch (error) {
      if (
        error.message ===
          'Telegram ID is required.' ||
        error.message ===
          'User not found.'
      ) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return next(error);
    }
  }
);

export default router;