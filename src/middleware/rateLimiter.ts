import rateLimit from 'express-rate-limit';

// general api rate limiter - 100 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    errors: ['Rate limit exceeded'],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// stricter limiter for auth endpoints - 10 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    errors: ['Rate limit exceeded'],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// order creation limiter - 10 orders per hour
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many orders placed, please try again later',
    errors: ['Rate limit exceeded'],
  },
  standardHeaders: true,
  legacyHeaders: false,
});
