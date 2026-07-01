import { getDatabase } from '../config/database';

export interface Cliente {
  id: number;
  empresa_id: number;
  nombre: string;
  rut: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export class ClienteRepository {
  static async findByEmpresa(empresaId: number): Promise<Cliente[]> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM clientes WHERE empresa_id = $1 AND deleted_at IS NULL ORDER BY nombre',
      [empresaId],
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Cliente | null> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM clientes WHERE id = $1 AND deleted_at IS NULL',
      [id],
    );
    return result.rows[0] || null;
  }

  static async findByRut(empresaId: number, rut: string): Promise<Cliente | null> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM clientes WHERE empresa_id = $1 AND rut = $2 AND deleted_at IS NULL',
      [empresaId, rut],
    );
    return result.rows[0] || null;
  }

  static async create(data: Partial<Cliente>): Promise<Cliente> {
    const db = getDatabase();
    const result = await db.query(
      `INSERT INTO clientes (empresa_id, nombre, rut, email, telefono, direccion, ciudad, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [data.empresa_id, data.nombre, data.rut, data.email, data.telefono, data.direccion, data.ciudad, data.activo ?? true],
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<Cliente>): Promise<Cliente | null> {
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
      `UPDATE clientes SET ${fields.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} AND deleted_at IS NULL 
       RETURNING *`,
      values,
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<void> {
    const db = getDatabase();
    await db.query('UPDATE clientes SET deleted_at = NOW() WHERE id = $1', [id]);
  }
}
