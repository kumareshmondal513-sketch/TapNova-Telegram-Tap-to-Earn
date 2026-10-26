const requests = new Map();

export function rateLimitMiddleware(options = {}) {
  const windowMs = Number(options.windowMs) || 60 * 1000;
  const maxRequests = Number(options.maxRequests) || 60;

  return (req, res, next) => {
    const forwarded = req.headers['x-forwarded-for'];

    const ip = forwarded
      ? String(forwarded).split(',')[0].trim()
      : req.ip || req.socket?.remoteAddress || 'unknown';

    const now = Date.now();

    let record = requests.get(ip);

    if (!record || now - record.startedAt >= windowMs) {
      record = {
        startedAt: now,
        count: 0
      };
    }

    record.count += 1;

    requests.set(ip, record);

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    res.setHeader(
      'X-RateLimit-Limit',
      String(maxRequests)
    );

    res.setHeader(
      'X-RateLimit-Remaining',
      String(
        Math.max(
          0,
          maxRequests - record.count
        )
      )
    );

    next();
  };
}

export function cleanupRateLimitStore() {
  const now = Date.now();

  for (const [ip, record] of requests.entries()) {
    if (now - record.startedAt >= 60 * 60 * 1000) {
      requests.delete(ip);
    }
  }
}

setInterval(
  cleanupRateLimitStore,
  10 * 60 * 1000
).unref();