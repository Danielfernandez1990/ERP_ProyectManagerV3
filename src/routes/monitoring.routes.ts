import { Router, Request, Response } from 'express';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import monitoringService from '../services/monitoringService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * Get health status
 * GET /api/monitoring/health
 */
router.get(
  '/health',
  asyncHandler(async (req: Request, res: Response) => {
    const health = monitoringService.getHealth();
    res.json({ data: health });
  }),
);

/**
 * Get statistics
 * GET /api/monitoring/stats
 */
router.get(
  '/stats',
  authMiddleware,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { minutes = 60 } = req.query;
    const stats = monitoringService.getEstadisticas(parseInt(minutes as string));
    res.json({ data: stats });
  }),
);

/**
 * Get monitoring report
 * GET /api/monitoring/report
 */
router.get(
  '/report',
  authMiddleware,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const report = monitoringService.generarReporte();
    res.json({ data: report });
  }),
);

/**
 * Export metrics to monitoring service
 * POST /api/monitoring/export
 */
router.post(
  '/export',
  authMiddleware,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { service } = req.body;

    if (service === 'datadog') {
      const metrics = monitoringService.exportarParaDatadog();
      // TODO: Enviar a Datadog API
      res.json({ message: 'Metrics exported to Datadog', data: metrics });
    } else {
      res.status(400).json({ error: 'Unknown monitoring service' });
    }
  }),
);

export default router;
