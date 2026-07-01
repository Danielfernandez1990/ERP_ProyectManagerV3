import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ProyectoRepository } from '../repositories/proyectoRepository';
import { ClienteRepository } from '../repositories/clienteRepository';
import { AuditService } from '../services/auditService';
import logger from '../utils/logger';

/**
 * Get all proyectos
 * GET /api/proyectos
 */
export const getAllProyectos = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const proyectos = await ProyectoRepository.findByEmpresa(authReq.user.empresaId);

  res.json({
    data: proyectos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      cliente_id: p.cliente_id,
      estado: p.estado,
      fecha_inicio: p.fecha_inicio,
      fecha_fin: p.fecha_fin,
      presupuesto: p.presupuesto,
    })),
  });
});

/**
 * Get proyecto by ID
 * GET /api/proyectos/:id
 */
export const getProyectoById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const authReq = req as any;

  const proyecto = await ProyectoRepository.findById(parseInt(id, 10));
  if (!proyecto) {
    throw new AppError(404, 'PROYECTO_NOT_FOUND', 'Proyecto not found');
  }

  if (proyecto.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access proyecto from another empresa');
  }

  res.json({ data: proyecto });
});

/**
 * Create proyecto
 * POST /api/proyectos
 */
export const createProyecto = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { nombre, cliente_id, descripcion, fecha_inicio, presupuesto } = req.body;

  // Validaciones
  if (!nombre || !fecha_inicio) {
    throw new AppError(400, 'MISSING_FIELDS', 'Nombre y fecha_inicio requeridos');
  }

  // Verificar cliente
  if (cliente_id) {
    const cliente = await ClienteRepository.findById(cliente_id);
    if (!cliente || cliente.empresa_id !== authReq.user.empresaId) {
      throw new AppError(404, 'CLIENTE_NOT_FOUND', 'Cliente not found');
    }
  }

  const proyecto = await ProyectoRepository.create({
    empresa_id: authReq.user.empresaId,
    nombre,
    cliente_id,
    descripcion,
    fecha_inicio: new Date(fecha_inicio),
    presupuesto,
    responsable_id: authReq.user.userId,
    activo: true,
  });

  // Auditoría
  await AuditService.log(
    authReq.user.empresaId,
    authReq.user.userId,
    'CREATE',
    'proyecto',
    proyecto.id,
    { nombre, cliente_id },
    req.ip,
    req.headers['user-agent'],
  );

  logger.info('Proyecto created:', { proyectoId: proyecto.id, nombre });

  res.status(201).json({
    message: 'Proyecto created successfully',
    data: {
      id: proyecto.id,
      nombre: proyecto.nombre,
      estado: proyecto.estado,
    },
  });
});

/**
 * Update proyecto
 * PUT /api/proyectos/:id
 */
export const updateProyecto = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;
  const { nombre, estado, fecha_fin, presupuesto } = req.body;

  const proyecto = await ProyectoRepository.findById(parseInt(id, 10));
  if (!proyecto) {
    throw new AppError(404, 'PROYECTO_NOT_FOUND', 'Proyecto not found');
  }

  if (proyecto.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access proyecto from another empresa');
  }

  const updateData: any = {};
  if (nombre) updateData.nombre = nombre;
  if (estado) updateData.estado = estado;
  if (fecha_fin) updateData.fecha_fin = new Date(fecha_fin);
  if (presupuesto) updateData.presupuesto = presupuesto;

  const updated = await ProyectoRepository.update(proyecto.id, updateData);

  // Auditoría
  await AuditService.log(
    authReq.user.empresaId,
    authReq.user.userId,
    'UPDATE',
    'proyecto',
    proyecto.id,
    updateData,
    req.ip,
    req.headers['user-agent'],
  );

  logger.info('Proyecto updated:', { proyectoId: proyecto.id });

  res.json({
    message: 'Proyecto updated successfully',
    data: updated,
  });
});

/**
 * Delete proyecto
 * DELETE /api/proyectos/:id
 */
export const deleteProyecto = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;

  const proyecto = await ProyectoRepository.findById(parseInt(id, 10));
  if (!proyecto) {
    throw new AppError(404, 'PROYECTO_NOT_FOUND', 'Proyecto not found');
  }

  if (proyecto.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access proyecto from another empresa');
  }

  await ProyectoRepository.delete(proyecto.id);

  // Auditoría
  await AuditService.log(
    authReq.user.empresaId,
    authReq.user.userId,
    'DELETE',
    'proyecto',
    proyecto.id,
    { nombre: proyecto.nombre },
    req.ip,
    req.headers['user-agent'],
  );

  logger.info('Proyecto deleted:', { proyectoId: proyecto.id });

  res.json({ message: 'Proyecto deleted successfully' });
});

/**
 * Get proyectos by cliente
 * GET /api/proyectos/cliente/:clienteId
 */
export const getProyectosByCliente = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { clienteId } = req.params;

  // Verificar cliente existe y pertenece a empresa
  const cliente = await ClienteRepository.findById(parseInt(clienteId, 10));
  if (!cliente || cliente.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access cliente from another empresa');
  }

  const proyectos = await ProyectoRepository.findByCliente(parseInt(clienteId, 10));

  res.json({
    data: proyectos,
  });
});
