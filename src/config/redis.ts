import { createClient, RedisClientType } from 'redis';
import { config } from './env';
import winston from 'winston';

const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

let redisClient: RedisClientType | null = null;

export const initRedis = async (): Promise<RedisClientType> => {
  try {
    redisClient = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password || undefined,
      db: config.redis.db || 0,
    }) as RedisClientType;

    redisClient.on('error', (err) => logger.error('Redis error:', err));
    redisClient.on('connect', () => logger.info('✅ Redis connected'));

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error('❌ Redis connection error:', error);
    throw error;
  }
};

export const getRedis = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call initRedis first.');
  }
  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.disconnect();
    logger.info('✅ Redis connection closed');
  }
};
