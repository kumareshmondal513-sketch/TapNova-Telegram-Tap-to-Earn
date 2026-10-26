import {
  getAdminAnalytics
} from '../services/adminAnalyticsService.js';

export async function getAdminAnalyticsController(
  req,
  res,
  next
) {
  try {
    const result = await getAdminAnalytics();

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}