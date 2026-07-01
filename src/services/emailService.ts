import nodemailer from 'nodemailer';
import { config } from '../config/env';
import logger from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  cc?: string[];
  bcc?: string[];
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  /**
   * Send email
   */
  async send(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: config.smtp.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        cc: options.cc,
        bcc: options.bcc,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully:', { messageId: info.messageId, to: options.to });
    } catch (error) {
      logger.error('Failed to send email:', { error, to: options.to });
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, nombre: string): Promise<void> {
    const html = `
      <h1>Bienvenido a ERP V3.0</h1>
      <p>Hola ${nombre},</p>
      <p>Tu cuenta ha sido creada exitosamente.</p>
      <p>
        <a href="http://localhost:5173/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Iniciar sesión
        </a>
      </p>
      <p>Saludos,<br>El equipo de ERP V3.0</p>
    `;

    await this.send({
      to: email,
      subject: 'Bienvenido a ERP V3.0',
      html,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    const html = `
      <h1>Restablecer contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <p>
        <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Restablecer contraseña
        </a>
      </p>
      <p>Este enlace expira en 24 horas.</p>
      <p>Si no solicitaste este cambio, ignora este email.</p>
    `;

    await this.send({
      to: email,
      subject: 'Restablecer contraseña - ERP V3.0',
      html,
    });
  }

  /**
   * Send license expiration warning
   */
  async sendLicenseExpirationWarning(email: string, empresaNombre: string, diasRestantes: number): Promise<void> {
    const html = `
      <h1>Advertencia: Licencia por expirar</h1>
      <p>Hola,</p>
      <p>Tu licencia para <strong>${empresaNombre}</strong> expirará en <strong>${diasRestantes} días</strong>.</p>
      <p>Por favor, renueva tu licencia para evitar interrupciones en el servicio.</p>
      <p>
        <a href="http://localhost:5173/admin/licencias" style="background-color: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Renovar licencia
        </a>
      </p>
      <p>Saludos,<br>El equipo de ERP V3.0</p>
    `;

    await this.send({
      to: email,
      subject: `Advertencia: Licencia por expirar en ${diasRestantes} días`,
      html,
    });
  }

  /**
   * Send project notification
   */
  async sendProjectNotification(
    email: string,
    nombreProyecto: string,
    accion: 'created' | 'updated' | 'completed',
  ): Promise<void> {
    const acciones: Record<string, string> = {
      created: 'creado',
      updated: 'actualizado',
      completed: 'completado',
    };

    const html = `
      <h1>Notificación de Proyecto</h1>
      <p>El proyecto <strong>${nombreProyecto}</strong> ha sido ${acciones[accion]}.</p>
      <p>
        <a href="http://localhost:5173/proyectos" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Ver proyecto
        </a>
      </p>
    `;

    await this.send({
      to: email,
      subject: `Proyecto ${acciones[accion]}: ${nombreProyecto}`,
      html,
    });
  }

  /**
   * Send task assignment
   */
  async sendTaskAssignment(email: string, nombreTarea: string, nombreProyecto: string): Promise<void> {
    const html = `
      <h1>Nueva Tarea Asignada</h1>
      <p>Se te ha asignado una nueva tarea: <strong>${nombreTarea}</strong></p>
      <p>Proyecto: <strong>${nombreProyecto}</strong></p>
      <p>
        <a href="http://localhost:5173/tareas" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Ver tareas
        </a>
      </p>
    `;

    await this.send({
      to: email,
      subject: `Nueva tarea asignada: ${nombreTarea}`,
      html,
    });
  }

  /**
   * Test SMTP connection
   */
  async test(): Promise<{ success: boolean; message: string }> {
    try {
      await this.transporter.verify();
      logger.info('SMTP connection test passed');
      return { success: true, message: 'SMTP connection successful' };
    } catch (error) {
      logger.error('SMTP connection test failed:', error);
      return { success: false, message: `SMTP connection failed: ${error}` };
    }
  }
}

export default new EmailService();
