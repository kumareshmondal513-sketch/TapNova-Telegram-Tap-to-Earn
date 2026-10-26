import {
  getAdminSettings
} from '../services/adminSettingsService.js';

import {
  getAdminDashboard
} from '../services/adminDashboardService.js';

export async function getAdminSystemController(
  req,
  res,
  next
) {
  try {
    const [
      settings,
      dashboard
    ] = await Promise.all([
      getAdminSettings(),
      getAdminDashboard()
    ]);

    return res.status(200).json({
      success: true,
      system: {
        maintenanceMode:
          settings.maintenanceMode === true,

        withdrawalsEnabled:
          settings.withdrawalsEnabled === true,

        referralsEnabled:
          settings.referralsEnabled === true,

        tasksEnabled:
          settings.tasksEnabled === true,

        language:
          settings.language || 'bn',

        totalUsers:
          dashboard.dashboard.totalUsers,

        totalTasks:
          dashboard.dashboard.totalTasks,

        totalWithdrawals:
          dashboard.dashboard.totalWithdrawals,

        totalAdmins:
          dashboard.dashboard.totalAdmins,

        generatedAt: Date.now()
      }
    });
  } catch (error) {
    return next(error);
  }
}