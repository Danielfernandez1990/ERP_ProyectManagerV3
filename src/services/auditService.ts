import { getDatabase } from '../config/database';
import logger from '../utils/logger';

export interface AuditLog {
  id: number;
  empresa_id: number;
  usuario_id: number;
  accion: string;
  entidad: string;
  entidad_id: number;
  cambios: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}

export class AuditService {
  /**
   * Register audit log
   */
  static async log(
    empresaId: number,
    usuarioId: number,
    accion: string,
    entidad: string,
    entidadId: number,
    cambios?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      const db = getDatabase();
      
      // Create audit_logs table if it doesn't exist
      await db.query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          empresa_id INTEGER NOT NULL REFERENCES empresas(id),
          usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
          accion VARCHAR(50) NOT NULL,
          entidad VARCHAR(50) NOT NULL,
          entidad_id INTEGER NOT NULL,
          cambios JSONB,
          ip_address VARCHAR(50),
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await db.query(
        `INSERT INTO audit_logs (empresa_id, usuario_id, accion, entidad, entidad_id, cambios, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [empresaId, usuarioId, accion, entidad, entidadId, cambios ? JSON.stringify(cambios) : null, ipAddress, userAgent],
      );

      logger.info('Audit log recorded:', {
        empresaId,
        usuarioId,
        accion,
        entidad,
      });
    } catch (error) {
      logger.error('Failed to record audit log:', error);
    }
  }

  /**
   * Get audit logs for empresa
   */
  static async getLogsForEmpresa(empresaId: number, limit: number = 100): Promise<AuditLog[]> {
    try {
      const db = getDatabase();
      const result = await db.query(
        `SELECT * FROM audit_logs 
         WHERE empresa_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [empresaId, limit],
      );
      return result.rows;
    } catch (error) {
      logger.error('Failed to get audit logs:', error);
      return [];
    }
  }

  /**
   * Get audit logs for usuario
   */
  static async getLogsForUsuario(usuarioId: number, limit: number = 50): Promise<AuditLog[]> {
    try {
      const db = getDatabase();
      const result = await db.query(
        `SELECT * FROM audit_logs 
         WHERE usuario_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [usuarioId, limit],
      );
      return result.rows;
    } catch (error) {
      logger.error('Failed to get audit logs:', error);
      return [];
    }
  }

  /**
   * Get audit logs for specific entity
   */
  static async getLogsForEntity(entidad: string, entidadId: number): Promise<AuditLog[]> {
    try {
      const db = getDatabase();
      const result = await db.query(
        `SELECT * FROM audit_logs 
         WHERE entidad = $1 AND entidad_id = $2 
         ORDER BY created_at DESC`,
        [entidad, entidadId],
      );
      return result.rows;
    } catch (error) {
      logger.error('Failed to get audit logs:', error);
      return [];
    }
  }
}
