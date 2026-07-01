/**
 * SMTP Routes
 * 
 * Rutas para gestionar configuración y pruebas de SMTP
 */

import { Router } from 'express';
import {
  testSMTPConnection,
  sendTestSMTPEmail,
  saveSMTPConfig,
} from '../controllers/smtpController';

const router = Router();

/**
 * POST /api/smtp/test-connection
 * Probar conexión SMTP
 */
router.post('/test-connection', testSMTPConnection);

/**
 * POST /api/smtp/send-test-email
 * Enviar correo de prueba
 */
router.post('/send-test-email', sendTestSMTPEmail);

/**
 * POST /api/smtp/save-config
 * Guardar configuración SMTP
 */
router.post('/save-config', saveSMTPConfig);

export default router;
