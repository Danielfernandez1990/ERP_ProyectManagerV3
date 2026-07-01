import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { validate, productoSchemas } from '../utils/validators';
import { ProductoRepository } from '../repositories/productoRepository';
import logger from '../utils/logger';

/**
 * Get all productos
 * GET /api/productos
 */
export const getAllProductos = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const productos = await ProductoRepository.findByEmpresa(authReq.user.empresaId);

  res.json({
    data: productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      sku: p.sku,
      precio: p.precio,
      stock: p.stock,
      stock_minimo: p.stock_minimo,
    })),
  });
});

/**
 * Get producto by ID
 * GET /api/productos/:id
 */
export const getProductoById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const authReq = req as any;

  const producto = await ProductoRepository.findById(parseInt(id, 10));
  if (!producto) {
    throw new AppError(404, 'PRODUCTO_NOT_FOUND', 'Producto not found');
  }

  if (producto.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access producto from another empresa');
  }

  res.json({ data: producto });
});

/**
 * Create producto
 * POST /api/productos
 */
export const createProducto = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const data = validate(req.body, productoSchemas.create);

  // Check if SKU already exists
  const existing = await ProductoRepository.findBySku(authReq.user.empresaId, data.sku);
  if (existing) {
    throw new AppError(409, 'SKU_ALREADY_EXISTS', 'Producto with this SKU already exists');
  }

  const producto = await ProductoRepository.create({
    empresa_id: authReq.user.empresaId,
    nombre: data.nombre,
    sku: data.sku,
    descripcion: data.descripcion,
    precio: data.precio,
    stock: data.stock,
  });

  logger.info('Producto created:', { productoId: producto.id, sku: producto.sku });

  res.status(201).json({
    message: 'Producto created successfully',
    data: {
      id: producto.id,
      nombre: producto.nombre,
      sku: producto.sku,
      precio: producto.precio,
    },
  });
});

/**
 * Update producto
 * PUT /api/productos/:id
 */
export const updateProducto = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;

  const producto = await ProductoRepository.findById(parseInt(id, 10));
  if (!producto) {
    throw new AppError(404, 'PRODUCTO_NOT_FOUND', 'Producto not found');
  }

  if (producto.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access producto from another empresa');
  }

  const data = validate(req.body, productoSchemas.update);

  if (data.sku && data.sku !== producto.sku) {
    const existing = await ProductoRepository.findBySku(authReq.user.empresaId, data.sku);
    if (existing) {
      throw new AppError(409, 'SKU_ALREADY_EXISTS', 'Producto with this SKU already exists');
    }
  }

  const updated = await ProductoRepository.update(producto.id, data);

  logger.info('Producto updated:', { productoId: producto.id });

  res.json({
    message: 'Producto updated successfully',
    data: updated,
  });
});

/**
 * Delete producto
 * DELETE /api/productos/:id
 */
export const deleteProducto = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { id } = req.params;

  const producto = await ProductoRepository.findById(parseInt(id, 10));
  if (!producto) {
    throw new AppError(404, 'PRODUCTO_NOT_FOUND', 'Producto not found');
  }

  if (producto.empresa_id !== authReq.user.empresaId) {
    throw new AppError(403, 'FORBIDDEN', 'Cannot access producto from another empresa');
  }

  await ProductoRepository.delete(producto.id);

  logger.info('Producto deleted:', { productoId: producto.id });

  res.json({ message: 'Producto deleted successfully' });
});
