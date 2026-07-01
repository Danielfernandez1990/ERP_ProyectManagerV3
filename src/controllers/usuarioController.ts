import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { validate, usuarioSchemas } from '../utils/validators';
import { UsuarioRepository } from '../repositories/usuarioRepository';
import { hashPassword, comparePassword } from '../utils/crypto';
import logger from '../utils/logger';

/**
 * Get all users (ADMIN only)
 * GET /api/usuarios
 */
export const getAllUsuarios = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const usuarios = await UsuarioRepository.findByEmpresa(authReq.user.empresaId);

  res.json({
    data: usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
      activo: u.activo,
      supervisor_id: u.supervisor_id,
    })),
  });
});

/**
 * Get user by ID
 * GET /api/usuarios/:id
 */
export const getUsuarioById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const usuario = await UsuarioRepository.findById(parseInt(id, 10));
  if (!usuario) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  }

  // Check if user belongs to same empresa
  const authReq = req as any;
  if (usuario.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access user from another empresa');
  }

  res.json({
    data: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      supervisor_id: usuario.supervisor_id,
    },
  });
});

/**
 * Create new usuario
 * POST /api/usuarios
 */
export const createUsuario = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;

  // Only ADMIN can create users
  if (!['SUPER_ADMIN', 'ADMIN'].includes(authReq.user.rol)) {
    throw new AppError(403, 'FORBIDDEN', 'Only admins can create users');
  }

  const data = validate(req.body, usuarioSchemas.create);

  // Check if email already exists
  const existingUser = await UsuarioRepository.findByEmail(data.email);
  if (existingUser) {
    throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'Email already registered');
  }

  const passwordHash = await hashPassword(data.password);

  const usuario = await UsuarioRepository.create({
    empresa_id: authReq.user.empresaId,
    nombre: data.nombre,
    email: data.email,
    password_hash: passwordHash,
    rol: data.rol,
    supervisor_id: data.supervisor_id,
    activo: true,
  });

  logger.info('User created:', { userId: usuario.id, email: usuario.email });

  res.status(201).json({
    message: 'User created successfully',
    data: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  });
});

/**
 * Update usuario
 * PUT /api/usuarios/:id
 */
export const updateUsuario = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;

  const usuario = await UsuarioRepository.findById(parseInt(id, 10));
  if (!usuario) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  }

  // Check permissions
  if (usuario.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access user from another empresa');
  }

  if (usuario.id !== authReq.user.userId && !['SUPER_ADMIN', 'ADMIN'].includes(authReq.user.rol)) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot modify another user');
  }

  const data = validate(req.body, usuarioSchemas.update);

  // Check email uniqueness if changing email
  if (data.email && data.email !== usuario.email) {
    const existingUser = await UsuarioRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'Email already registered');
    }
  }

  const updated = await UsuarioRepository.update(usuario.id, data);

  logger.info('User updated:', { userId: usuario.id });

  res.json({
    message: 'User updated successfully',
    data: {
      id: updated!.id,
      nombre: updated!.nombre,
      email: updated!.email,
      rol: updated!.rol,
    },
  });
});

/**
 * Delete usuario
 * DELETE /api/usuarios/:id
 */
export const deleteUsuario = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;

  // Only ADMIN can delete users
  if (!['SUPER_ADMIN', 'ADMIN'].includes(authReq.user.rol)) {
    throw new AppError(403, 'FORBIDDEN', 'Only admins can delete users');
  }

  const usuario = await UsuarioRepository.findById(parseInt(id, 10));
  if (!usuario) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  }

  if (usuario.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access user from another empresa');
  }

  await UsuarioRepository.delete(usuario.id);

  logger.info('User deleted:', { userId: usuario.id });

  res.json({
    message: 'User deleted successfully',
  });
});

/**
 * Update password
 * PUT /api/usuarios/:id/password
 */
export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // User can only change their own password
  if (parseInt(id, 10) !== authReq.user.userId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot change another user password');
  }

  const usuario = await UsuarioRepository.findById(parseInt(id, 10));
  if (!usuario) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  }

  // Verify current password
  const isValid = await comparePassword(currentPassword, usuario.password_hash);
  if (!isValid) {
    throw new AppError(401, 'INVALID_PASSWORD', 'Current password is incorrect');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  await UsuarioRepository.update(usuario.id, { password_hash: newPasswordHash });

  logger.info('User password updated:', { userId: usuario.id });

  res.json({
    message: 'Password updated successfully',
  });
});
