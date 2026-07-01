import { getDatabase } from '../config/database';

export interface Tarea {
  id: number;
  proyecto_id: number;
  usuario_id: number | null;
  titulo: string;
  descripcion: string | null;
  estado: 'por_hacer' | 'en_progreso' | 'en_revision' | 'completada';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  fecha_vencimiento: Date | null;
  horas_estimadas: number | null;
  horas_reales: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export class TareaRepository {
  static async findByProyecto(proyectoId: number): Promise<Tarea[]> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM tareas WHERE proyecto_id = $1 AND deleted_at IS NULL ORDER BY prioridad DESC, fecha_vencimiento ASC',
      [proyectoId],
    );
    return result.rows;
  }

  static async findByUsuario(usuarioId: number): Promise<Tarea[]> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM tareas WHERE usuario_id = $1 AND deleted_at IS NULL ORDER BY fecha_vencimiento ASC',
      [usuarioId],
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Tarea | null> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM tareas WHERE id = $1 AND deleted_at IS NULL',
      [id],
    );
    return result.rows[0] || null;
  }

  static async create(data: Partial<Tarea>): Promise<Tarea> {
    const db = getDatabase();
    const result = await db.query(
      `INSERT INTO tareas (proyecto_id, usuario_id, titulo, descripcion, estado, prioridad, fecha_vencimiento, horas_estimadas)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [data.proyecto_id, data.usuario_id, data.titulo, data.descripcion, data.estado ?? 'por_hacer', data.prioridad ?? 'media', data.fecha_vencimiento, data.horas_estimadas],
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<Tarea>): Promise<Tarea | null> {
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
      `UPDATE tareas SET ${fields.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} AND deleted_at IS NULL 
       RETURNING *`,
      values,
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<void> {
    const db = getDatabase();
    await db.query('UPDATE tareas SET deleted_at = NOW() WHERE id = $1', [id]);
  }

  static async findByEstado(proyectoId: number, estado: string): Promise<Tarea[]> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM tareas WHERE proyecto_id = $1 AND estado = $2 AND deleted_at IS NULL ORDER BY prioridad DESC',
      [proyectoId, estado],
    );
    return result.rows;
  }
}
