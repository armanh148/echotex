import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  skip: (req) => {
    // Skip rate limits in test environments or internal health checks or local development
    return req.path === '/api/health' || 
      process.env.NODE_ENV === 'test' || 
      process.env.NODE_ENV !== 'production' ||
      req.ip === '127.0.0.1' || 
      req.ip === '::1' ||
      req.ip === '::ffff:127.0.0.1';
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit.authMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  skip: (req) => process.env.NODE_ENV === 'test' || process.env.NODE_ENV !== 'production' || req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1',
});

export const quotesLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Quote request rate limit exceeded. Please try again later or contact our sales hotline directly.',
  },
  skip: (req) => process.env.NODE_ENV === 'test' || process.env.NODE_ENV !== 'production' || req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1',
});

export default {
  generalLimiter,
  authLimiter,
  quotesLimiter,
};
