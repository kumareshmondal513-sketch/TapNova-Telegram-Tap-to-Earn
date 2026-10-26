import {
  getAdminRole,
  setAdminRole,
  removeAdminRole,
  getValidAdminRoles
} from '../services/adminRoleService.js';

export async function getAdminRoleController(
  req,
  res,
  next
) {
  try {
    const { telegramId } = req.params;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'Telegram ID is required.'
      });
    }

    const admin = await getAdminRole(telegramId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin role not found.'
      });
    }

    return res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    next(error);
  }
}

export async function setAdminRoleController(
  req,
  res,
  next
) {
  try {
    const { telegramId, role } = req.body;

    if (!telegramId || !role) {
      return res.status(400).json({
        success: false,
        message: 'Telegram ID and role are required.'
      });
    }

    const assignedBy =
      req.user?.telegramId ??
      req.telegramId ??
      null;

    const result = await setAdminRole(
      telegramId,
      role,
      assignedBy
    );

    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message === 'Invalid admin role.' ||
      error.message === 'Telegram ID is required.' ||
      error.message ===
        'The main admin role cannot be removed.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
}

export async function removeAdminRoleController(
  req,
  res,
  next
) {
  try {
    const { telegramId } = req.params;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'Telegram ID is required.'
      });
    }

    const result = await removeAdminRole(telegramId);

    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message === 'Admin role not found.' ||
      error.message ===
        'The main admin cannot be removed.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
}

export async function getValidAdminRolesController(
  req,
  res,
  next
) {
  try {
    return res.status(200).json({
      success: true,
      roles: getValidAdminRoles()
    });
  } catch (error) {
    next(error);
  }
}