import { getDatabase } from '../config/database';

export interface Proyecto {
  id: number;
  empresa_id: number;
  cliente_id: number | null;
  nombre: string;
  descripcion: string | null;
  estado: 'en_progreso' | 'completado' | 'suspendido' | 'cancelado';
  fecha_inicio: Date;
  fecha_fin: Date | null;
  presupuesto: number | null;
  responsable_id: number | null;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export class ProyectoRepository {
  static async findByEmpresa(empresaId: number): Promise<Proyecto[]> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM proyectos WHERE empresa_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC',
      [empresaId],
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Proyecto | null> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM proyectos WHERE id = $1 AND deleted_at IS NULL',
      [id],
    );
    return result.rows[0] || null;
  }

  static async findByCliente(clienteId: number): Promise<Proyecto[]> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM proyectos WHERE cliente_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC',
      [clienteId],
    );
    return result.rows;
  }

  static async create(data: Partial<Proyecto>): Promise<Proyecto> {
    const db = getDatabase();
    const result = await db.query(
      `INSERT INTO proyectos (empresa_id, cliente_id, nombre, descripcion, estado, fecha_inicio, fecha_fin, presupuesto, responsable_id, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [data.empresa_id, data.cliente_id, data.nombre, data.descripcion, data.estado ?? 'en_progreso', data.fecha_inicio, data.fecha_fin, data.presupuesto, data.responsable_id, data.activo ?? true],
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<Proyecto>): Promise<Proyecto | null> {
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
      `UPDATE proyectos SET ${fields.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} AND deleted_at IS NULL 
       RETURNING *`,
      values,
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<void> {
    const db = getDatabase();
    await db.query('UPDATE proyectos SET deleted_at = NOW() WHERE id = $1', [id]);
  }
}
