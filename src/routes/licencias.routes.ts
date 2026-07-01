import { Router } from 'express';
import {
  getLicenciaEmpresa,
  createLicencia,
  updateLicencia,
  checkLicencia,
} from '../controllers/licenciaController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/empresa', getLicenciaEmpresa);
router.get('/check', checkLicencia);
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN'), createLicencia);
router.put('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), updateLicencia);

export default router;
