import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

export interface JWTPayload {
  userId: number;
  empresaId: number;
  email: string;
  rol: string;
}

export const generateToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expire as SignOptions['expiresIn'],
    algorithm: 'HS256',
  };
  return jwt.sign(payload, config.jwt.secret, options);
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpire as SignOptions['expiresIn'],
    algorithm: 'HS256',
  };
  return jwt.sign(payload, config.jwt.refreshSecret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  } catch {
    throw new Error('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  return jwt.decode(token) as JWTPayload | null;
};
