import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { validate, licenciaSchemas } from '../utils/validators';
import { LicenciaRepository } from '../repositories/licenciaRepository';
import { UsuarioRepository } from '../repositories/usuarioRepository';
import logger from '../utils/logger';

/**
 * Get license for empresa
 * GET /api/licencias/empresa
 */
export const getLicenciaEmpresa = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;

  const licencia = await LicenciaRepository.findByEmpresa(authReq.user.empresaId);
  if (!licencia) {
    throw new AppError(404, 'LICENCIA_NOT_FOUND', 'No license found for this empresa');
  }

  const usuariosActivos = await UsuarioRepository.countActiveByEmpresa(authReq.user.empresaId);

  res.json({
    data: {
      ...licencia,
      usuarios_activos: usuariosActivos,
      porcentaje_uso: Math.round((usuariosActivos / licencia.usuarios_max) * 100),
    },
  });
});

/**
 * Get all licenses (SUPER_ADMIN only)
 * GET /api/admin/licencias
 */
export const getAllLicencias = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;

  if (authReq.user.rol !== 'SUPER_ADMIN') {
    throw new AppError(403, 'FORBIDDEN', 'Only SUPER_ADMIN can view all licenses');
  }

  // TODO: Implement admin endpoint to view all licenses
  res.json({ data: [] });
});

/**
 * Create license
 * POST /api/admin/licencias
 */
export const createLicencia = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;

  if (authReq.user.rol !== 'SUPER_ADMIN') {
    throw new AppError(403, 'FORBIDDEN', 'Only SUPER_ADMIN can create licenses');
  }

  const data = validate(req.body, licenciaSchemas.create);

  const licencia = await LicenciaRepository.create({
    empresa_id: authReq.user.empresaId,
    plan: data.plan,
    usuarios_max: data.usuarios_max,
    fecha_inicio: data.fecha_inicio,
    fecha_expiracion: data.fecha_expiracion,
    estado: 'activo',
  });

  logger.info('License created:', { licenciaId: licencia.id, plan: licencia.plan });

  res.status(201).json({
    message: 'License created successfully',
    data: licencia,
  });
});

/**
 * Update license
 * PUT /api/licencias/:id
 */
export const updateLicencia = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;

  if (!['SUPER_ADMIN', 'ADMIN'].includes(authReq.user.rol)) {
    throw new AppError(403, 'FORBIDDEN', 'Admin access required');
  }

  const licencia = await LicenciaRepository.findById(parseInt(id, 10));
  if (!licencia) {
    throw new AppError(404, 'LICENCIA_NOT_FOUND', 'License not found');
  }

  const data = validate(req.body, licenciaSchemas.update);
  const updated = await LicenciaRepository.update(licencia.id, data);

  logger.info('License updated:', { licenciaId: licencia.id });

  res.json({
    message: 'License updated successfully',
    data: updated,
  });
});

/**
 * Check license validity
 * GET /api/licencias/check
 */
export const checkLicencia = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;

  const isValid = await LicenciaRepository.isValid(authReq.user.empresaId);

  res.json({
    data: {
      valid: isValid,
      message: isValid ? 'License is valid' : 'License is invalid or expired',
    },
  });
});
