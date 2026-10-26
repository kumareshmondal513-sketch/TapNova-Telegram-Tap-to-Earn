import express from 'express';
import {
  getAdmin,
  listAdmins,
  createAdmin
} from '../services/adminService.js';

const router = express.Router();

router.get('/check/:telegramId', async (req, res, next) => {
  try {
    const admin = await getAdmin(req.params.telegramId);

    res.json({
      success: true,
      isAdmin: Boolean(
        admin &&
        admin.enabled === true &&
        ['main_admin', 'sub_admin', 'chairman'].includes(admin.role)
      ),
      role:
        admin && admin.enabled === true
          ? admin.role
          : null
    });
  } catch (error) {
    next(error);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const { actorTelegramId } = req.query;
    const actor = await getAdmin(actorTelegramId);

    if (
      !actor ||
      actor.enabled !== true ||
      actor.role !== 'main_admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only the main admin can view the administrator list.'
      });
    }

    const admins = await listAdmins();

    res.json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    next(error);
  }
});

router.post('/add', async (req, res, next) => {
  try {
    const {
      actorTelegramId,
      targetTelegramId,
      role
    } = req.body;

    const result = await createAdmin(
      actorTelegramId,
      targetTelegramId,
      role || 'sub_admin'
    );

    res.status(201).json(result);
  } catch (error) {
    const clientErrors = [
      'Only the main admin can add administrators.',
      'A valid Telegram ID is required.',
      'Invalid administrator role.',
      'Target user must start the bot first.',
      'This administrator already exists.'
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