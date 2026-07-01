import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { TareaRepository } from '../repositories/tareaRepository';
import { ProyectoRepository } from '../repositories/proyectoRepository';
import { UsuarioRepository } from '../repositories/usuarioRepository';
import { AuditService } from '../services/auditService';
import pushNotificationService from '../services/pushNotificationService';
import logger from '../utils/logger';

/**
 * Get all tareas by proyecto
 * GET /api/proyectos/:proyectoId/tareas
 */
export const getTareasByProyecto = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { proyectoId } = req.params;

  const proyecto = await ProyectoRepository.findById(parseInt(proyectoId, 10));
  if (!proyecto || proyecto.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access proyecto from another empresa');
  }

  const tareas = await TareaRepository.findByProyecto(parseInt(proyectoId, 10));

  res.json({
    data: tareas,
  });
});

/**
 * Get tarea by ID
 * GET /api/tareas/:id
 */
export const getTareaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const tarea = await TareaRepository.findById(parseInt(id, 10));
  if (!tarea) {
    throw new AppError(404, 'TAREA_NOT_FOUND', 'Tarea not found');
  }

  res.json({ data: tarea });
});

/**
 * Get tareas by usuario
 * GET /api/usuarios/:usuarioId/tareas
 */
export const getTareasByUsuario = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { usuarioId } = req.params;

  // Verificar que el usuario pertenece a la misma empresa
  const usuario = await UsuarioRepository.findById(parseInt(usuarioId, 10));
  if (!usuario || usuario.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access usuario from another empresa');
  }

  const tareas = await TareaRepository.findByUsuario(parseInt(usuarioId, 10));

  res.json({
    data: tareas,
  });
});

/**
 * Create tarea
 * POST /api/proyectos/:proyectoId/tareas
 */
export const createTarea = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { proyectoId } = req.params;
  const { titulo, descripcion, usuario_id, prioridad, fecha_vencimiento, horas_estimadas } = req.body;

  // Validaciones
  if (!titulo) {
    throw new AppError(400, 'MISSING_FIELDS', 'Titulo requerido');
  }

  // Verificar proyecto
  const proyecto = await ProyectoRepository.findById(parseInt(proyectoId, 10));
  if (!proyecto || proyecto.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access proyecto from another empresa');
  }

  // Verificar usuario si se proporciona
  if (usuario_id) {
    const usuario = await UsuarioRepository.findById(usuario_id);
    if (!usuario || usuario.empresa_id !== authReq.user.empresaId) {
      throw new AppError(404, 'USUARIO_NOT_FOUND', 'Usuario not found');
    }
  }

  const tarea = await TareaRepository.create({
    proyecto_id: parseInt(proyectoId, 10),
    usuario_id,
    titulo,
    descripcion,
    prioridad,
    fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : undefined,
    horas_estimadas,
  });

  // Enviar notificación push si hay usuario asignado
  if (usuario_id) {
    await pushNotificationService.notifyTaskAssignment(
      `device_token_${usuario_id}`,
      titulo,
      proyecto.nombre,
    );
  }

  // Auditoría
  await AuditService.log(
    authReq.user.empresaId,
    authReq.user.userId,
    'CREATE',
    'tarea',
    tarea.id,
    { titulo, usuario_id, prioridad },
    req.ip,
    req.headers['user-agent'],
  );

  logger.info('Tarea created:', { tareaId: tarea.id, titulo });

  res.status(201).json({
    message: 'Tarea created successfully',
    data: {
      id: tarea.id,
      titulo: tarea.titulo,
      estado: tarea.estado,
    },
  });
});

/**
 * Update tarea
 * PUT /api/tareas/:id
 */
export const updateTarea = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;
  const { titulo, descripcion, estado, prioridad, usuario_id, fecha_vencimiento, horas_reales } = req.body;

  const tarea = await TareaRepository.findById(parseInt(id, 10));
  if (!tarea) {
    throw new AppError(404, 'TAREA_NOT_FOUND', 'Tarea not found');
  }

  const updateData: any = {};
  if (titulo) updateData.titulo = titulo;
  if (descripcion) updateData.descripcion = descripcion;
  if (estado) updateData.estado = estado;
  if (prioridad) updateData.prioridad = prioridad;
  if (usuario_id !== undefined) updateData.usuario_id = usuario_id;
  if (fecha_vencimiento) updateData.fecha_vencimiento = new Date(fecha_vencimiento);
  if (horas_reales) updateData.horas_reales = horas_reales;

  const updated = await TareaRepository.update(tarea.id, updateData);

  // Notificar cambios en tiempo real
  // TODO: Emit WebSocket event

  // Auditoría
  await AuditService.log(
    authReq.user.empresaId,
    authReq.user.userId,
    'UPDATE',
    'tarea',
    tarea.id,
    updateData,
    req.ip,
    req.headers['user-agent'],
  );

  logger.info('Tarea updated:', { tareaId: tarea.id });

  res.json({
    message: 'Tarea updated successfully',
    data: updated,
  });
});

/**
 * Delete tarea
 * DELETE /api/tareas/:id
 */
export const deleteTarea = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;

  const tarea = await TareaRepository.findById(parseInt(id, 10));
  if (!tarea) {
    throw new AppError(404, 'TAREA_NOT_FOUND', 'Tarea not found');
  }

  await TareaRepository.delete(tarea.id);

  // Auditoría
  await AuditService.log(
    authReq.user.empresaId,
    authReq.user.userId,
    'DELETE',
    'tarea',
    tarea.id,
    { titulo: tarea.titulo },
    req.ip,
    req.headers['user-agent'],
  );

  logger.info('Tarea deleted:', { tareaId: tarea.id });

  res.json({ message: 'Tarea deleted successfully' });
});

/**
 * Get tareas by estado
 * GET /api/proyectos/:proyectoId/tareas/estado/:estado
 */
export const getTareasByEstado = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { proyectoId, estado } = req.params;

  const proyecto = await ProyectoRepository.findById(parseInt(proyectoId, 10));
  if (!proyecto || proyecto.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access proyecto from another empresa');
  }

  const tareas = await TareaRepository.findByEstado(parseInt(proyectoId, 10), estado);

  res.json({
    data: tareas,
  });
});

/**
 * Bulk update tareas (para Kanban)
 * PUT /api/proyectos/:proyectoId/tareas/bulk
 */
export const bulkUpdateTareas = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { proyectoId } = req.params;
  const { updates } = req.body;

  const proyecto = await ProyectoRepository.findById(parseInt(proyectoId, 10));
  if (!proyecto || proyecto.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access proyecto from another empresa');
  }

  if (!Array.isArray(updates)) {
    throw new AppError(400, 'INVALID_FORMAT', 'Updates debe ser un array');
  }

  const results = [];

  for (const update of updates) {
    const { id, ...data } = update;
    const tarea = await TareaRepository.findById(id);
    if (tarea) {
      const updated = await TareaRepository.update(id, data);
      results.push(updated);
    }
  }

  logger.info('Bulk update tareas:', { proyectoId, count: results.length });

  res.json({
    message: 'Tareas updated successfully',
    data: results,
  });
});
