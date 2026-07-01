import admin from 'firebase-admin';
import { config } from '../config/env';
import logger from '../utils/logger';

interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: string;
  sound?: string;
  icon?: string;
}

interface NotificationRequest {
  userId: number;
  deviceToken: string;
  payload: PushNotificationPayload;
}

class PushNotificationService {
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize Firebase Admin SDK
   */
  private init(): void {
    // TODO: Initialize Firebase Admin SDK with service account
    // For now, this is a placeholder
    logger.info('Push Notification Service initialized');
  }

  /**
   * Send push notification to single device
   */
  async sendToDevice(deviceToken: string, payload: PushNotificationPayload): Promise<{ success: boolean; messageId?: string }> {
    try {
      if (!this.initialized) {
        logger.warn('Firebase Admin not initialized, skipping push notification');
        return { success: false };
      }

      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        android: {
          priority: 'high' as const,
          notification: {
            sound: payload.sound || 'default',
            channelId: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: payload.sound || 'default',
              badge: payload.badge || '1',
            },
          },
        },
        webpush: {
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/logo.png',
          },
        },
      };

      // TODO: Send via Firebase admin.messaging().send(message)
      logger.info('Push notification sent:', { deviceToken, title: payload.title });

      return {
        success: true,
        messageId: 'fcm_' + Date.now(),
      };
    } catch (error) {
      logger.error('Failed to send push notification:', error);
      return { success: false };
    }
  }

  /**
   * Send push notification to multiple devices
   */
  async sendToDevices(deviceTokens: string[], payload: PushNotificationPayload): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const token of deviceTokens) {
      const result = await this.sendToDevice(token, payload);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Send task notification
   */
  async notifyTaskAssignment(deviceToken: string, nombreTarea: string, nombreProyecto: string): Promise<void> {
    const payload: PushNotificationPayload = {
      title: 'Nueva Tarea Asignada',
      body: `${nombreTarea} en ${nombreProyecto}`,
      data: {
        type: 'task_assignment',
        title: nombreTarea,
        project: nombreProyecto,
      },
      sound: 'default',
      badge: '1',
    };

    await this.sendToDevice(deviceToken, payload);
  }

  /**
   * Send project update notification
   */
  async notifyProjectUpdate(deviceToken: string, nombreProyecto: string, accion: string): Promise<void> {
    const payload: PushNotificationPayload = {
      title: 'Actualización de Proyecto',
      body: `${nombreProyecto} ha sido ${accion}`,
      data: {
        type: 'project_update',
        project: nombreProyecto,
        action: accion,
      },
    };

    await this.sendToDevice(deviceToken, payload);
  }

  /**
   * Send license expiration notification
   */
  async notifyLicenseExpiration(deviceToken: string, diasRestantes: number): Promise<void> {
    const payload: PushNotificationPayload = {
      title: 'Licencia por Expirar',
      body: `Tu licencia expirará en ${diasRestantes} días`,
      data: {
        type: 'license_expiration',
        days_remaining: diasRestantes.toString(),
      },
      badge: diasRestantes.toString(),
    };

    await this.sendToDevice(deviceToken, payload);
  }

  /**
   * Send chat message notification
   */
  async notifyNewMessage(deviceToken: string, remitente: string, mensaje: string): Promise<void> {
    const payload: PushNotificationPayload = {
      title: `Mensaje de ${remitente}`,
      body: mensaje.substring(0, 100),
      data: {
        type: 'new_message',
        sender: remitente,
      },
      sound: 'default',
    };

    await this.sendToDevice(deviceToken, payload);
  }
}

export default new PushNotificationService();
