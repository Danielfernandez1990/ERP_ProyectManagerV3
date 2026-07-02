// Fix: authController.ts - remove reference to non-existent 'estado' property
import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { validate, authSchemas } from '../utils/validators';
import { UsuarioRepository } from '../repositories/usuarioRepository';
import { getDatabase } from '../config/database';
import { hashPassword, comparePassword } from '../utils/crypto';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import logger from '../utils/logger';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(req.body, authSchemas.register);

  const existingUser = await UsuarioRepository.findByEmail(data.email);
  if (existingUser) {
    throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'Email already registered');
  }

  const db = getDatabase();
  try {
    await db.query('BEGIN');

    const empresaResult = await db.query(
      'INSERT INTO empresas (nombre) VALUES ($1) RETURNING id',
      [data.empresa_nombre],
    );
    const empresaId = empresaResult.rows[0].id;
    const passwordHash = await hashPassword(data.password);

    const usuario = await UsuarioRepository.create({
      empresa_id: empresaId,
      nombre: data.nombre,
      email: data.email,
      password_hash: passwordHash,
      rol: 'SUPER_ADMIN',
      activo: true,
    });

    await db.query(
      `INSERT INTO licencias (empresa_id, plan, usuarios_max, fecha_inicio, fecha_expiracion, estado)
       VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '30 days', 'activo')`,
      [empresaId, 'BASICO', 5],
    );

    await db.query('COMMIT');

    const token = generateToken({ userId: usuario.id, empresaId: usuario.empresa_id, email: usuario.email, rol: usuario.rol });
    const refreshToken = generateRefreshToken({ userId: usuario.id, empresaId: usuario.empresa_id, email: usuario.email, rol: usuario.rol });

    res.status(201).json({
      message: 'User registered successfully',
      data: { user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }, tokens: { access: token, refresh: refreshToken } },
    });
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(req.body, authSchemas.login);
  const usuario = await UsuarioRepository.findByEmail(data.email);

  if (!usuario) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

  logger.info('User found:', { userId: usuario.id, email: usuario.email, activo: usuario.activo });

  const isValidPassword = await comparePassword(data.password, usuario.password_hash);
  if (!isValidPassword) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  if (!usuario.activo) throw new AppError(403, 'USER_INACTIVE', 'User account is inactive');

  const token = generateToken({ userId: usuario.id, empresaId: usuario.empresa_id, email: usuario.email, rol: usuario.rol });
  const refreshToken = generateRefreshToken({ userId: usuario.id, empresaId: usuario.empresa_id, email: usuario.email, rol: usuario.rol });

  logger.info('User logged in:', { userId: usuario.id });

  res.json({
    message: 'Login successful',
    data: { user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }, tokens: { access: token, refresh: refreshToken } },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const data = validate(req.body, authSchemas.refresh);
  const payload = verifyRefreshToken(data.refreshToken);
  const usuario = await UsuarioRepository.findById(payload.userId);

  if (!usuario) throw new AppError(401, 'USER_NOT_FOUND', 'User not found');

  const token = generateToken({ userId: usuario.id, empresaId: usuario.empresa_id, email: usuario.email, rol: usuario.rol });

  res.json({ message: 'Token refreshed', data: { access: token } });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const usuario = await UsuarioRepository.findById(authReq.user.userId);
  if (!usuario) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');

  res.json({ data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, empresa_id: usuario.empresa_id } });
});
