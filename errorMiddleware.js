export function notFoundMiddleware(
  req,
  res
) {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
    path: req.originalUrl
  });
}

export function errorMiddleware(
  error,
  req,
  res,
  next
) {
  console.error(
    '[API ERROR]',
    error
  );

  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    Number.isInteger(error.statusCode)
      ? error.statusCode
      : 500;

  const message =
    statusCode >= 500
      ? 'Internal server error.'
      : (
          error.message ||
          'Request failed.'
        );

  res.status(statusCode).json({
    success: false,
    message
  });
}