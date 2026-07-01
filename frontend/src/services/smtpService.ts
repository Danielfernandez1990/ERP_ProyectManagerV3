/**
 * Servicio SMTP - Integración Real con Backend + localStorage
 */

export interface SMTPConfig {
  servidor: string;
  puerto: number;
  email: string;
  contraseña: string;
  cifrado: 'TLS' | 'SSL' | 'NONE';
}

const API_BASE = 'http://localhost:3000/api/smtp';
const STORAGE_KEY = 'smtp_config';

/**
 * Probar conexión SMTP
 */
export const testSMTPConnection = async (config: SMTPConfig): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error de conexión SMTP');
    }

    return true;
  } catch (error) {
    console.error('Error SMTP:', error);
    throw error;
  }
};

/**
 * Enviar correo de prueba REAL
 */
export const sendTestEmail = async (
  config: SMTPConfig,
  destinatario: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!destinatario || !destinatario.includes('@')) {
      throw new Error('Correo de destino inválido');
    }

    const response = await fetch(`${API_BASE}/send-test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...config,
        destinatario,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error al enviar correo',
      };
    }

    return {
      success: true,
      message: `Correo enviado a ${destinatario}`,
    };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

/**
 * Guardar configuración SMTP en backend
 */
export const saveSMTPConfig = async (config: SMTPConfig): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/save-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al guardar configuración');
    }
  } catch (error) {
    console.error('Error al guardar SMTP:', error);
    throw error;
  }
};

/**
 * Validar configuración SMTP
 */
export const validateSMTPConfig = (config: SMTPConfig): string[] => {
  const errors: string[] = [];

  if (!config.servidor?.trim()) {
    errors.push('Servidor SMTP requerido');
  }

  if (!config.puerto || config.puerto < 1 || config.puerto > 65535) {
    errors.push('Puerto inválido (1-65535)');
  }

  if (!config.email?.trim()) {
    errors.push('Email requerido');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(config.email)) {
    errors.push('Formato de email inválido');
  }

  if (!config.contraseña?.trim()) {
    errors.push('Contraseña requerida');
  }

  return errors;
};

/**
 * Cargar configuración SMTP desde localStorage
 */
export const getSMTPConfig = (): SMTPConfig | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error cargando SMTP config:', error);
    return null;
  }
};

/**
 * Guardar configuración SMTP en localStorage
 */
export const setSMTPConfig = (config: SMTPConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    console.log('✅ SMTP config guardada en localStorage');
  } catch (error) {
    console.error('Error guardando SMTP config:', error);
  }
};
