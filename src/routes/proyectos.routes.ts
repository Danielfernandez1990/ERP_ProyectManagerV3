import { Router } from 'express';
import {
  getAllProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  getProyectosByCliente,
} from '../controllers/proyectoController';
import {
  getTareasByProyecto,
  getTareaById,
  getTareasByUsuario,
  createTarea,
  updateTarea,
  deleteTarea,
  getTareasByEstado,
  bulkUpdateTareas,
} from '../controllers/tareaController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

/**
 * Proyectos routes
 */
router.get('/', getAllProyectos);
router.get('/:id', getProyectoById);
router.post('/', createProyecto);
router.put('/:id', updateProyecto);
router.delete('/:id', deleteProyecto);

/**
 * Proyectos by Cliente
 */
router.get('/cliente/:clienteId', getProyectosByCliente);

/**
 * Tareas routes
 */
router.get('/:proyectoId/tareas', getTareasByProyecto);
router.post('/:proyectoId/tareas', createTarea);
router.get('/:proyectoId/tareas/estado/:estado', getTareasByEstado);
router.put('/:proyectoId/tareas/bulk', bulkUpdateTareas);

/**
 * Tareas por usuario
 */
router.get('/usuarios/:usuarioId/tareas', getTareasByUsuario);

/**
 * Tareas individual
 */
router.get('/tareas/:id', getTareaById);
router.put('/tareas/:id', updateTarea);
router.delete('/tareas/:id', deleteTarea);

export default router;
