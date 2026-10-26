import express from 'express';

import {
  getAdminPermissions,
  getRolePermissionMap
} from '../services/adminPermissionService.js';

import {
  requireAnyAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/mine',
  requireAnyAdmin(),
  async (req, res, next) => {
    try {
      const telegramId =
        req.user?.telegramId ??
        req.telegramId;

      const permissions =
        await getAdminPermissions(telegramId);

      return res.status(200).json({
        success: true,
        permissions
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/roles',
  requireAnyAdmin(),
  (req, res) => {
    return res.status(200).json({
      success: true,
      permissions: getRolePermissionMap()
    });
  }
);

export default router;