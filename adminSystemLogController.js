import {
  createSystemLog,
  getSystemLogs,
  getValidSystemLogLevels
} from '../services/adminSystemLogService.js';

export async function getSystemLogsController(
  req,
  res,
  next
) {
  try {
    const logs = await getSystemLogs({
      level: req.query.level || null,
      limit: req.query.limit
    });

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    if (
      error.message ===
      'Invalid system log level.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
}

export async function createSystemLogController(
  req,
  res,
  next
) {
  try {
    const {
      level = 'info',
      event,
      message,
      source = 'admin',
      metadata = null
    } = req.body || {};

    const result = await createSystemLog({
      level,
      event,
      message,
      source,
      metadata
    });

    return res.status(201).json(result);
  } catch (error) {
    const clientErrors = [
      'Invalid system log level.',
      'System log event is required.',
      'System log message is required.'
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

export function getSystemLogLevelsController(
  req,
  res
) {
  return res.status(200).json({
    success: true,
    levels: getValidSystemLogLevels()
  });
}