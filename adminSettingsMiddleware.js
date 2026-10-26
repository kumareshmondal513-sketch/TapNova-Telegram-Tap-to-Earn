import {
  getAdminSettings
} from '../services/adminSettingsService.js';

export async function loadAdminSettings(
  req,
  res,
  next
) {
  try {
    req.adminSettings =
      await getAdminSettings();

    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireFeatureEnabled(
  featureName
) {
  return async function featureMiddleware(
    req,
    res,
    next
  ) {
    try {
      const settings =
        req.adminSettings ||
        await getAdminSettings();

      if (
        typeof featureName !== 'string' ||
        !featureName.trim()
      ) {
        return res.status(500).json({
          success: false,
          message: 'Feature is not configured.'
        });
      }

      const enabled =
        settings[featureName];

      if (enabled !== true) {
        return res.status(503).json({
          success: false,
          message:
            'This feature is currently disabled.'
        });
      }

      req.adminSettings = settings;

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export async function requireWithdrawalsEnabled(
  req,
  res,
  next
) {
  return requireFeatureEnabled(
    'withdrawalsEnabled'
  )(req, res, next);
}

export async function requireReferralsEnabled(
  req,
  res,
  next
) {
  return requireFeatureEnabled(
    'referralsEnabled'
  )(req, res, next);
}

export async function requireTasksEnabled(
  req,
  res,
  next
) {
  return requireFeatureEnabled(
    'tasksEnabled'
  )(req, res, next);
}

export async function requireNotInMaintenance(
  req,
  res,
  next
) {
  try {
    const settings =
      req.adminSettings ||
      await getAdminSettings();

    if (settings.maintenanceMode === true) {
      return res.status(503).json({
        success: false,
        message:
          'The service is currently under maintenance.'
      });
    }

    req.adminSettings = settings;

    return next();
  } catch (error) {
    return next(error);
  }
}