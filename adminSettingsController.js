import {
  getAdminSettings,
  updateAdminSettings
} from '../services/adminSettingsService.js';

function getAdminTelegramId(req) {
  return (
    req.user?.telegramId ??
    req.admin?.telegramId ??
    req.telegramId ??
    null
  );
}

export async function getSettingsController(
  req,
  res,
  next
) {
  try {
    const settings = await getAdminSettings();

    return res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateSettingsController(
  req,
  res,
  next
) {
  try {
    const adminTelegramId =
      getAdminTelegramId(req);

    if (!adminTelegramId) {
      return res.status(401).json({
        success: false,
        message: 'Admin identity is required.'
      });
    }

    const result = await updateAdminSettings({
      settings: req.body,
      adminTelegramId
    });

    return res.status(200).json(result);
  } catch (error) {
    const clientErrorMessages = [
      'Admin Telegram ID is required.',
      'Valid settings object is required.',
      'No valid settings were provided.',
      'Language must be bn or en.',
      'Minimum withdrawal coins must be a non-negative integer.',
      'Task ad countdown must be between 0 and 60 seconds.'
    ];

    const isClientError =
      clientErrorMessages.includes(error.message) ||
      error.message.startsWith(
        'Setting cannot be changed:'
      ) ||
      error.message.endsWith(
        'must be true or false.'
      );

    if (isClientError) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
}

export async function getPublicFeatureSettingsController(
  req,
  res,
  next
) {
  try {
    const settings = await getAdminSettings();

    return res.status(200).json({
      success: true,
      features: {
        maintenanceMode:
          settings.maintenanceMode === true,

        withdrawalsEnabled:
          settings.withdrawalsEnabled === true,

        referralsEnabled:
          settings.referralsEnabled === true,

        tasksEnabled:
          settings.tasksEnabled === true,

        language:
          settings.language || 'bn'
      }
    });
  } catch (error) {
    return next(error);
  }
}