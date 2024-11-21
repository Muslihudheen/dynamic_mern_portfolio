import { Express } from 'express';
import helmet from 'helmet';

export const configureSecurityMiddleware = (app: Express) => {
  // Basic security headers
  app.use(helmet());

  // CORS configuration
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  // Basic request limiter
  let requestCounts = new Map<string, { count: number; timestamp: number }>();
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_REQUESTS = 500;

  app.use((req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    // Clean up old entries
    for (const [key, value] of requestCounts.entries()) {
      if (value.timestamp < windowStart) {
        requestCounts.delete(key);
      }
    }

    // Get or create record for this IP
    const record = requestCounts.get(ip) || { count: 0, timestamp: now };

    // Reset if outside window
    if (record.timestamp < windowStart) {
      record.count = 0;
      record.timestamp = now;
    }

    // Increment count
    record.count++;
    requestCounts.set(ip, record);

    if (record.count > MAX_REQUESTS) {
      return res.status(429).json({
        message: 'Too many requests, please try again later.'
      });
    }

    next();
  });
};