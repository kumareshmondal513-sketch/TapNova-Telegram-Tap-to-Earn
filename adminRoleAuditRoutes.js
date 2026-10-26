import express from 'express';

import {
  getAdminRoleAuditLogs
} from '../services/adminRoleAuditService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const limit = Number(req.query.limit) || 50;

      const targetTelegramId =
        req.query.targetTelegramId || null;

      if (
        targetTelegramId !== null &&
        !/^\d{1,20}$/.test(String(targetTelegramId))
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid target Telegram ID.'
        });
      }

      const logs = await getAdminRoleAuditLogs({
        limit,
        targetTelegramId
      });

      return res.status(200).json({
        success: true,
        count: logs.length,
        logs
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;