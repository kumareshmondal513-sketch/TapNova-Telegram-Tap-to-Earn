import {
  validateBulkDeleteUsers
} from '../validation/adminUserBulkDeleteValidation.js';

export function validateBulkDeleteUsersMiddleware(req, res, next) {
  const result = validateBulkDeleteUsers(req.body);

  if (!result.valid) {
    return res.status(400).json({
      success: false,
      message: 'Request validation failed.',
      errors: result.errors
    });
  }

  next();
}