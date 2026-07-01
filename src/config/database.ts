import { Pool } from 'pg';
import { config } from './env';
import winston from 'winston';

const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

let pool: Pool;

export const initDatabase = async (): Promise<Pool> => {
  try {
    pool = new Pool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    });

    // Test connection
    const res = await pool.query('SELECT NOW()');
    logger.info('✅ Database connected:', res.rows[0]);

    return pool;
  } catch (error) {
    logger.error('❌ Database connection error:', error);
    throw error;
  }
};

export const getDatabase = (): Pool => {
  if (!pool) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }
  return pool;
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    logger.info('✅ Database connection closed');
  }
};
