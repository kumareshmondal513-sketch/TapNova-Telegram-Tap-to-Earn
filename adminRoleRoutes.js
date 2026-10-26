import express from 'express';

import {
  getAdminRole,
  setAdminRole,
  removeAdminRole,
  hasAdminRole,
  getValidAdminRoles
} from '../services/adminRoleService.js';

const router = express.Router();

function getTelegramId(req) {
  return (
    req.user?.telegramId ??
    req.telegramId ??
    null
  );
}

function requireMainAdmin(req, res, next) {
  const telegramId = getTelegramId(req);

  if (!telegramId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  hasAdminRole(telegramId, ['main_admin'])
    .then((allowed) => {
      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: 'Main admin permission required.'
        });
      }

      next();
    })
    .catch(next);
}

router.get('/roles', requireMainAdmin, (req, res) => {
  res.json({
    success: true,
    roles: getValidAdminRoles()
  });
});

router.get('/:telegramId', requireMainAdmin, async (req, res, next) => {
  try {
    const admin = await getAdminRole(
      req.params.telegramId
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin role not found.'
      });
    }

    return res.json({
      success: true,
      admin
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireMainAdmin, async (req, res, next) => {
  try {
    const { telegramId, role } = req.body;

    if (!telegramId || !role) {
      return res.status(400).json({
        success: false,
        message: 'Telegram ID and role are required.'
      });
    }

    const result = await setAdminRole(
      telegramId,
      role,
      getTelegramId(req)
    );

    return res.json(result);
  } catch (error) {
    if (
      error.message === 'Invalid admin role.' ||
      error.message === 'Telegram ID is required.' ||
      error.message === 'The main admin role cannot be removed.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

router.delete('/:telegramId', requireMainAdmin, async (req, res, next) => {
  try {
    const result = await removeAdminRole(
      req.params.telegramId
    );

    return res.json(result);
  } catch (error) {
    if (
      error.message === 'Admin role not found.' ||
      error.message === 'The main admin cannot be removed.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

export default router;