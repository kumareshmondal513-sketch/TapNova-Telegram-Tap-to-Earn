import {
  getAdminSecuritySettings,
  updateAdminSecuritySettings,
  resetAdminSecuritySettings
} from '../services/adminSecurityService.js';

function getAdminTelegramId(req) {
  return (
    req.user?.telegramId ??
    req.admin?.telegramId ??
    req.telegramId ??
    null
  );
}

export async function getSecurityController(
  req,
  res,
  next
) {
  try {
    const settings =
      await getAdminSecuritySettings();

    return res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateSecurityController(
  req,
  res,
  next
) {
  try {
    const updatedBy =
      getAdminTelegramId(req);

    if (!updatedBy) {
      return res.status(401).json({
        success: false,
        message:
          'Admin identity is required.'
      });
    }

    const result =
      await updateAdminSecuritySettings({
        settings: req.body?.settings,
        updatedBy
      });

    return res.status(200).json(result);
  } catch (error) {
    const clientErrors = [
      'Admin Telegram ID is required.',
      'Security settings are required.'
    ];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
}

export async function resetSecurityController(
  req,
  res,
  next
) {
  try {
    const updatedBy =
      getAdminTelegramId(req);

    if (!updatedBy) {
      return res.status(401).json({
        success: false,
        message:
          'Admin identity is required.'
      });
    }

    const result =
      await resetAdminSecuritySettings(
        updatedBy
      );

    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message ===
      'Admin Telegram ID is required.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
}