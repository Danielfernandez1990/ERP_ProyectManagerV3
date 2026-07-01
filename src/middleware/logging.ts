import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import logger from '../utils/logger';

// Morgan token for user ID
morgan.token('user-id', (req: any) => {
  return req.user?.userId || 'anonymous';
});

// Morgan token for user email
morgan.token('user-email', (req: any) => {
  return req.user?.email || 'anonymous';
});

// Custom morgan format
export const morganMiddleware = morgan(
  ':remote-addr - :user-email [:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms - :res[content-length]',
  {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  },
);

// Request ID middleware
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || `${Date.now()}-${Math.random()}`;
  req.headers['x-request-id'] = String(requestId);
  res.setHeader('x-request-id', requestId);
  next();
};
