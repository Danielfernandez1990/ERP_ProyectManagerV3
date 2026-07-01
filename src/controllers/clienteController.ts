import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { validate, clienteSchemas } from '../utils/validators';
import { ClienteRepository } from '../repositories/clienteRepository';
import logger from '../utils/logger';

/**
 * Get all clientes
 * GET /api/clientes
 */
export const getAllClientes = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const clientes = await ClienteRepository.findByEmpresa(authReq.user.empresaId);

  res.json({
    data: clientes.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      rut: c.rut,
      email: c.email,
      telefono: c.telefono,
      ciudad: c.ciudad,
      activo: c.activo,
    })),
  });
});

/**
 * Get cliente by ID
 * GET /api/clientes/:id
 */
export const getClienteById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const authReq = req as any;

  const cliente = await ClienteRepository.findById(parseInt(id, 10));
  if (!cliente) {
    throw new AppError(404, 'CLIENTE_NOT_FOUND', 'Cliente not found');
  }

  if (cliente.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access cliente from another empresa');
  }

  res.json({ data: cliente });
});

/**
 * Create cliente
 * POST /api/clientes
 */
export const createCliente = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const data = validate(req.body, clienteSchemas.create);

  // Check if RUT already exists
  const existing = await ClienteRepository.findByRut(authReq.user.empresaId, data.rut);
  if (existing) {
    throw new AppError(409, 'RUT_ALREADY_EXISTS', 'Cliente with this RUT already exists');
  }

  const cliente = await ClienteRepository.create({
    empresa_id: authReq.user.empresaId,
    nombre: data.nombre,
    rut: data.rut,
    email: data.email,
    telefono: data.telefono,
  });

  logger.info('Cliente created:', { clienteId: cliente.id, nombre: cliente.nombre });

  res.status(201).json({
    message: 'Cliente created successfully',
    data: {
      id: cliente.id,
      nombre: cliente.nombre,
      rut: cliente.rut,
    },
  });
});

/**
 * Update cliente
 * PUT /api/clientes/:id
 */
export const updateCliente = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;

  const cliente = await ClienteRepository.findById(parseInt(id, 10));
  if (!cliente) {
    throw new AppError(404, 'CLIENTE_NOT_FOUND', 'Cliente not found');
  }

  if (cliente.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access cliente from another empresa');
  }

  const data = validate(req.body, clienteSchemas.update);

  if (data.rut && data.rut !== cliente.rut) {
    const existing = await ClienteRepository.findByRut(authReq.user.empresaId, data.rut);
    if (existing) {
      throw new AppError(409, 'RUT_ALREADY_EXISTS', 'Cliente with this RUT already exists');
    }
  }

  const updated = await ClienteRepository.update(cliente.id, data);

  logger.info('Cliente updated:', { clienteId: cliente.id });

  res.json({
    message: 'Cliente updated successfully',
    data: updated,
  });
});

/**
 * Delete cliente
 * DELETE /api/clientes/:id
 */
export const deleteCliente = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;

  const cliente = await ClienteRepository.findById(parseInt(id, 10));
  if (!cliente) {
    throw new AppError(404, 'CLIENTE_NOT_FOUND', 'Cliente not found');
  }

  if (cliente.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access cliente from another empresa');
  }

  await ClienteRepository.delete(cliente.id);

  logger.info('Cliente deleted:', { clienteId: cliente.id });

  res.json({ message: 'Cliente deleted successfully' });
});
