import express from 'express';

import {
  createAuditLog,
  getAuditLogs,
  deleteAuditLog
} from '../services/auditLogService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const logs = await getAuditLogs(
      req.query.limit || 100
    );

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      actorId,
      action,
      targetType,
      targetId,
      details,
      ip
    } = req.body;

    const log = await createAuditLog({
      actorId,
      action,
      targetType,
      targetId,
      details,
      ip
    });

    res.status(201).json({
      success: true,
      log
    });
  } catch (error) {
    if (
      error.message ===
      'Audit action is required.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

router.delete('/:logId', async (req, res, next) => {
  try {
    const result = await deleteAuditLog(
      req.params.logId
    );

    res.json(result);
  } catch (error) {
    const clientErrors = [
      'Audit log ID is required.',
      'Audit log not found.'
    ];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

export default router;