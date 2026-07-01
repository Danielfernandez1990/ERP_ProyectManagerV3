import { getDatabase } from '../config/database';

export interface Usuario {
  id: number;
  empresa_id: number;
  nombre: string;
  email: string;
  password_hash: string;
  rol: string;
  activo: boolean;
  supervisor_id: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export class UsuarioRepository {
  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<Usuario | null> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM usuarios WHERE email = $1 AND deleted_at IS NULL',
      [email],
    );
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<Usuario | null> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM usuarios WHERE id = $1 AND deleted_at IS NULL',
      [id],
    );
    return result.rows[0] || null;
  }

  /**
   * Find all users by empresa
   */
  static async findByEmpresa(empresaId: number): Promise<Usuario[]> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM usuarios WHERE empresa_id = $1 AND deleted_at IS NULL ORDER BY nombre',
      [empresaId],
    );
    return result.rows;
  }

  /**
   * Create new user
   */
  static async create(data: Partial<Usuario>): Promise<Usuario> {
    const db = getDatabase();
    const result = await db.query(
      `INSERT INTO usuarios (empresa_id, nombre, email, password_hash, rol, supervisor_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.empresa_id, data.nombre, data.email, data.password_hash, data.rol, data.supervisor_id],
    );
    return result.rows[0];
  }

  /**
   * Update user
   */
  static async update(id: number, data: Partial<Usuario>): Promise<Usuario | null> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && key !== 'deleted_at') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await db.query(
      `UPDATE usuarios SET ${fields.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} AND deleted_at IS NULL 
       RETURNING *`,
      values,
    );

    return result.rows[0] || null;
  }

  /**
   * Soft delete user
   */
  static async delete(id: number): Promise<void> {
    const db = getDatabase();
    await db.query(
      'UPDATE usuarios SET deleted_at = NOW() WHERE id = $1',
      [id],
    );
  }

  /**
   * Count active users by empresa
   */
  static async countActiveByEmpresa(empresaId: number): Promise<number> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT COUNT(*) FROM usuarios WHERE empresa_id = $1 AND activo = true AND deleted_at IS NULL',
      [empresaId],
    );
    return parseInt(result.rows[0].count, 10);
  }
}
