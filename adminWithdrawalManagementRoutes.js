import express from 'express';

import {
  getWithdrawalRequests,
  updateWithdrawalStatus,
  getValidWithdrawalStatuses
} from '../services/adminWithdrawalManagementService.js';

import { requireMainAdmin } from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get('/statuses', (req, res) => {
  res.json({
    success: true,
    statuses: getValidWithdrawalStatuses()
  });
});

router.get('/', async (req, res, next) => {
  try {
    const status = req.query.status || null;
    const limit = Number(req.query.limit) || 50;

    const withdrawals = await getWithdrawalRequests({
      status,
      limit
    });

    res.json({
      success: true,
      count: withdrawals.length,
      withdrawals
    });
  } catch (error) {
    if (error.message === 'Invalid withdrawal status.') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

router.patch('/:withdrawalId/status', async (req, res, next) => {
  try {
    const adminTelegramId =
      req.user?.telegramId ??
      req.admin?.telegramId ??
      req.telegramId;

    const { status, note = '' } = req.body || {};

    if (!adminTelegramId) {
      return res.status(401).json({
        success: false,
        message: 'Admin identity is required.'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Withdrawal status is required.'
      });
    }

    const result = await updateWithdrawalStatus({
      withdrawalId: req.params.withdrawalId,
      status,
      adminTelegramId,
      note
    });

    res.json(result);
  } catch (error) {
    const clientErrors = [
      'Withdrawal ID and admin Telegram ID are required.',
      'Invalid withdrawal status.',
      'Withdrawal request not found.',
      'A completed withdrawal cannot be changed.',
      'Only approved withdrawals can be marked as paid.'
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