import { Pool } from 'pg';

// Mock database connection
jest.mock('../config/database', () => ({
  getDatabase: jest.fn(() => ({
    query: jest.fn(),
  })),
  initDatabase: jest.fn(async () => {}),
  closeDatabase: jest.fn(async () => {}),
}));

// Mock redis connection
jest.mock('../config/redis', () => ({
  getRedis: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  })),
  initRedis: jest.fn(async () => {}),
  closeRedis: jest.fn(async () => {}),
}));

// Mock logger
jest.mock('../utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Setup environment
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.SMTP_HOST = 'smtp.test.com';
process.env.SMTP_USER = 'test@test.com';
process.env.SMTP_PASS = 'test-password';

export {};
