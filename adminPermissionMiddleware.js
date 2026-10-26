import {
  hasPermission
} from '../services/adminPermissionService.js';

export function requirePermission(permission) {
  return async function permissionMiddleware(
    req,
    res,
    next
  ) {
    try {
      const telegramId =
        req.user?.telegramId ??
        req.telegramId;

      if (!telegramId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      if (
        typeof permission !== 'string' ||
        !permission.trim()
      ) {
        return res.status(500).json({
          success: false,
          message: 'Permission is not configured.'
        });
      }

      const allowed = await hasPermission(
        String(telegramId),
        permission
      );

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: 'Permission denied.'
        });
      }

      req.adminPermission = permission;

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requireRolePermission(
  permission
) {
  return requirePermission(permission);
}