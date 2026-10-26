import express from 'express';

import {
  getAdminAuditLogs,
  getAllowedAdminAuditActions
} from '../services/adminAuditService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get('/actions', (req, res) => {
  return res.status(200).json({
    success: true,
    actions: getAllowedAdminAuditActions()
  });
});

router.get('/', async (req, res, next) => {
  try {
    const logs = await getAdminAuditLogs({
      limit: req.query.limit,
      adminTelegramId:
        req.query.adminTelegramId || null,
      action: req.query.action || null
    });

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    if (
      error.message ===
      'Invalid admin audit action.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
});

export default router;