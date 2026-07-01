import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from './errorHandler';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    empresaId: number;
    email: string;
    rol: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No authorization header provided');
      throw new AppError(401, 'UNAUTHORIZED', 'No authorization header');
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    req.user = payload;
    logger.info('User authenticated:', { userId: payload.userId, email: payload.email });

    next();
  } catch (error: any) {
    logger.error('Authentication error:', error.message);
    res.status(401).json({
      code: 'UNAUTHORIZED',
      message: error.message || 'Unauthorized',
      timestamp: new Date().toISOString(),
    });
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'No user authenticated',
        timestamp: new Date().toISOString(),
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      logger.warn('Access denied for user:', { userId: req.user.userId, rol: req.user.rol });
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: `This endpoint requires one of these roles: ${allowedRoles.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !['SUPER_ADMIN', 'ADMIN'].includes(req.user.rol)) {
    return res.status(403).json({
      code: 'FORBIDDEN',
      message: 'Admin access required',
      timestamp: new Date().toISOString(),
    });
  }
  next();
};
