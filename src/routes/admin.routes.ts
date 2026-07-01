import { Router, Request, Response } from 'express';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import emailService from '../services/emailService';
import logger from '../utils/logger';

const router = Router();

router.use(authMiddleware);

/**
 * Test SMTP connection
 * GET /api/admin/email/test
 */
router.get('/email/test', requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = await emailService.test();
    res.json({
      message: result.message,
      success: result.success,
    });
  } catch (error) {
    logger.error('SMTP test failed:', error);
    res.status(500).json({
      code: 'SMTP_TEST_FAILED',
      message: 'SMTP connection test failed',
    });
  }
});

/**
 * Send test email
 * POST /api/admin/email/send-test
 */
router.post('/email/send-test', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        code: 'MISSING_EMAIL',
        message: 'Email is required',
      });
    }

    await emailService.send({
      to: email,
      subject: 'Correo de Prueba - ERP V3.0',
      html: '<h1>Este es un correo de prueba</h1><p>Si recibes este correo, SMTP está configurado correctamente.</p>',
    });

    res.json({
      message: 'Test email sent successfully',
      email,
    });
  } catch (error) {
    logger.error('Failed to send test email:', error);
    res.status(500).json({
      code: 'EMAIL_SEND_FAILED',
      message: 'Failed to send test email',
    });
  }
});

/**
 * Get system health
 * GET /api/admin/health
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

export default router;
