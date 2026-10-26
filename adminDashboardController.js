import {
  getAdminDashboard,
  getWithdrawalSummary,
  getTaskSummary
} from '../services/adminDashboardService.js';

export async function getDashboardController(
  req,
  res,
  next
) {
  try {
    const result =
      await getAdminDashboard();

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getWithdrawalSummaryController(
  req,
  res,
  next
) {
  try {
    const result =
      await getWithdrawalSummary();

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getTaskSummaryController(
  req,
  res,
  next
) {
  try {
    const result =
      await getTaskSummary();

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}