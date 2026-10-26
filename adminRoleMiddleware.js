import { hasAdminRole } from '../services/adminRoleService.js';

export function requireAdminRole(allowedRoles = [
  'main_admin',
  'sub_admin',
  'chairman'
]) {
  return async function adminRoleMiddleware(
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

      if (!Array.isArray(allowedRoles) ||
          allowedRoles.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Admin roles are not configured.'
        });
      }

      const allowed = await hasAdminRole(
        String(telegramId),
        allowedRoles
      );

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action.'
        });
      }

      req.admin = {
        telegramId: String(telegramId),
        allowedRoles
      };

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requireMainAdmin() {
  return requireAdminRole(['main_admin']);
}

export function requireAdminOrChairman() {
  return requireAdminRole([
    'main_admin',
    'chairman'
  ]);
}

export function requireAnyAdmin() {
  return requireAdminRole([
    'main_admin',
    'sub_admin',
    'chairman'
  ]);
}