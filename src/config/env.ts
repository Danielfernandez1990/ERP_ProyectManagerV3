import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // App
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  dataMode: process.env.DATA_MODE || 'local',

  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'erp_user',
    password: process.env.DB_PASSWORD || 'erp_password_123',
    database: process.env.DB_NAME || 'erp_v3_db',
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || 'redis_password_123',
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_secret_key_here',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },

  // SMTP
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@erp.local',
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publicKey: process.env.STRIPE_PUBLIC_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  // External API
  externalApi: {
    url: process.env.EXTERNAL_API_URL || '',
    key: process.env.EXTERNAL_API_KEY || '',
  },

  // CORS
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000').split(','),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Audit
  audit: {
    enabled: process.env.AUDIT_ENABLED !== 'false',
    logPath: process.env.AUDIT_LOG_PATH || './logs/audit.log',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
