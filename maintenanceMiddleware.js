import { getMaintenanceStatus } from '../services/maintenanceService.js';

export async function maintenanceMiddleware(
  req,
  res,
  next
) {
  try {
    const status = await getMaintenanceStatus();

    if (
      status.enabled === true &&
      req.path !== '/health' &&
      req.path !== '/api/health'
    ) {
      return res.status(503).json({
        success: false,
        maintenance: true,
        message:
          status.message ||
          'The service is temporarily under maintenance.'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}