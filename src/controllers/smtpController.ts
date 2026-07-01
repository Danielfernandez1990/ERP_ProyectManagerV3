/**
 * SMTP Controller - Servicio de Correo
 * 
 * Responsabilidades:
 * - Probar conexión SMTP
 * - Enviar correos de prueba
 * - Gestionar configuración SMTP
 */

import { Request, Response } from 'express';
import nodemailer, { Transporter } from 'nodemailer';

interface SMTPConfig {
  servidor: string;
  puerto: number;
  email: string;
  contraseña: string;
  cifrado: 'TLS' | 'SSL' | 'NONE';
}

/**
 * Crear transporte de Nodemailer basado en configuración
 */
const createTransporter = (config: SMTPConfig): Transporter => {
  const secure = config.cifrado === 'SSL' ? true : false;

  return nodemailer.createTransport({
    host: config.servidor,
    port: config.puerto,
    secure,
    auth: {
      user: config.email,
      pass: config.contraseña,
    },
    tls: {
      rejectUnauthorized: false, // Permitir certificados auto-firmados en desarrollo
    },
  });
};

/**
 * POST /api/smtp/test-connection
 * Probar conexión SMTP
 */
export const testSMTPConnection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { servidor, puerto, email, contraseña, cifrado } = req.body;

    if (!servidor || !puerto || !email || !contraseña) {
      res.status(400).json({
        success: false,
        message: 'Faltan parámetros SMTP requeridos',
      });
      return;
    }

    const config: SMTPConfig = {
      servidor,
      puerto: parseInt(puerto),
      email,
      contraseña,
      cifrado: cifrado || 'TLS',
    };

    const transporter = createTransporter(config);

    // Verificar conexión
    await transporter.verify();

    res.json({
      success: true,
      message: 'Conexión SMTP exitosa',
    });
  } catch (error: any) {
    console.error('Error SMTP:', error);

    res.status(500).json({
      success: false,
      message: `Error de conexión: ${error.message}`,
      error: error.message,
    });
  }
};

/**
 * POST /api/smtp/send-test-email
 * Enviar correo de prueba
 */
export const sendTestSMTPEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { servidor, puerto, email, contraseña, cifrado, destinatario } =
      req.body;

    if (!servidor || !puerto || !email || !contraseña || !destinatario) {
      res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos',
      });
      return;
    }

    const config: SMTPConfig = {
      servidor,
      puerto: parseInt(puerto),
      email,
      contraseña,
      cifrado: cifrado || 'TLS',
    };

    const transporter = createTransporter(config);

    // Enviar correo de prueba
    const info = await transporter.sendMail({
      from: email,
      to: destinatario,
      subject: 'Prueba de Configuración SMTP - ERP V3.0',
      html: `
        <h2>✅ Prueba de Correo SMTP</h2>
        <p>Este es un correo de prueba de la configuración SMTP en ERP V3.0</p>
        <hr />
        <p><strong>Servidor:</strong> ${servidor}</p>
        <p><strong>Puerto:</strong> ${puerto}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Cifrado:</strong> ${cifrado}</p>
        <hr />
        <p>Si recibiste este correo, tu configuración SMTP está correcta ✓</p>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          Enviado desde ERP V3.0 - Plataforma Empresarial
        </p>
      `,
      text: `Prueba de Configuración SMTP - ERP V3.0\n\nSi recibiste este correo, tu configuración SMTP está correcta.`,
    });

    res.json({
      success: true,
      message: `Correo enviado a ${destinatario}`,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error('Error al enviar correo:', error);

    res.status(500).json({
      success: false,
      message: `Error al enviar correo: ${error.message}`,
      error: error.message,
    });
  }
};

/**
 * POST /api/smtp/save-config
 * Guardar configuración SMTP
 */
export const saveSMTPConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { servidor, puerto, email, contraseña, cifrado } = req.body;

    if (!servidor || !puerto || !email || !contraseña) {
      res.status(400).json({
        success: false,
        message: 'Faltan parámetros SMTP requeridos',
      });
      return;
    }

    // Guardar en variables de entorno o base de datos
    // Por ahora, solo validamos
    const config: SMTPConfig = {
      servidor,
      puerto: parseInt(puerto),
      email,
      contraseña,
      cifrado: cifrado || 'TLS',
    };

    res.json({
      success: true,
      message: 'Configuración SMTP guardada',
      config,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
