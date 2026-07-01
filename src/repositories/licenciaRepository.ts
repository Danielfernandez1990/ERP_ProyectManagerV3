import { getDatabase } from '../config/database';

export interface Licencia {
  id: number;
  empresa_id: number;
  plan: 'BASICO' | 'PRO' | 'ENTERPRISE';
  usuarios_max: number;
  usuarios_activos: number;
  fecha_inicio: Date;
  fecha_expiracion: Date;
  estado: 'activo' | 'inactivo' | 'expirado';
  created_at: Date;
  updated_at: Date;
}

export class LicenciaRepository {
  /**
   * Find license by empresa
   */
  static async findByEmpresa(empresaId: number): Promise<Licencia | null> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM licencias WHERE empresa_id = $1 ORDER BY created_at DESC LIMIT 1',
      [empresaId],
    );
    return result.rows[0] || null;
  }

  /**
   * Find license by ID
   */
  static async findById(id: number): Promise<Licencia | null> {
    const db = getDatabase();
    const result = await db.query('SELECT * FROM licencias WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Create new license
   */
  static async create(data: Partial<Licencia>): Promise<Licencia> {
    const db = getDatabase();
    const result = await db.query(
      `INSERT INTO licencias (empresa_id, plan, usuarios_max, fecha_inicio, fecha_expiracion, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.empresa_id,
        data.plan,
        data.usuarios_max,
        data.fecha_inicio,
        data.fecha_expiracion,
        data.estado || 'activo',
      ],
    );
    return result.rows[0];
  }

  /**
   * Update license
   */
  static async update(id: number, data: Partial<Licencia>): Promise<Licencia | null> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await db.query(
      `UPDATE licencias SET ${fields.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} 
       RETURNING *`,
      values,
    );

    return result.rows[0] || null;
  }

  /**
   * Check if license is valid
   */
  static async isValid(empresaId: number, requiredActiveUsers?: number): Promise<boolean> {
    const licencia = await this.findByEmpresa(empresaId);

    if (!licencia || licencia.estado !== 'activo') {
      return false;
    }

    if (new Date() > new Date(licencia.fecha_expiracion)) {
      return false;
    }

    if (requiredActiveUsers && licencia.usuarios_activos >= licencia.usuarios_max) {
      return false;
    }

    return true;
  }
}
