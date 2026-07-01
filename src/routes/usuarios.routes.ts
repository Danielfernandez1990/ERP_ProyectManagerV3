import { Router } from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  updatePassword,
} from '../controllers/usuarioController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

/**
 * Usuario routes (all protected)
 */

router.use(authMiddleware);

// Get all usuarios (any authenticated user from same empresa)
router.get('/', getAllUsuarios);

// Get usuario by ID
router.get('/:id', getUsuarioById);

// Create usuario (admin only)
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN'), createUsuario);

// Update usuario
router.put('/:id', updateUsuario);

// Delete usuario (admin only)
router.delete('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), deleteUsuario);

// Update password
router.put('/:id/password', updatePassword);

export default router;
