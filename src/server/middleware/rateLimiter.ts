import rateLimit from 'express-rate-limit';

// 1. Strict Limiter for Authentication endpoints (Brute Force Protection)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

// 2. General API Rate Limiter
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // Max 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'High traffic detected. Please slow down your requests.'
  }
});

// 3. Sync Rate Limiter
export const syncRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Sync rate limit exceeded. Please wait a moment before sending another offline queue.'
  }
});

