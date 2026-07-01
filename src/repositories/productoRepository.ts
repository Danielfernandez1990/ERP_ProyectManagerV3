import { getDatabase } from '../config/database';

export interface Producto {
  id: number;
  empresa_id: number;
  nombre: string;
  sku: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  stock_minimo: number;
  proveedor_id: number | null;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export class ProductoRepository {
  static async findByEmpresa(empresaId: number): Promise<Producto[]> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM productos WHERE empresa_id = $1 AND deleted_at IS NULL ORDER BY nombre',
      [empresaId],
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Producto | null> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM productos WHERE id = $1 AND deleted_at IS NULL',
      [id],
    );
    return result.rows[0] || null;
  }

  static async findBySku(empresaId: number, sku: string): Promise<Producto | null> {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM productos WHERE empresa_id = $1 AND sku = $2 AND deleted_at IS NULL',
      [empresaId, sku],
    );
    return result.rows[0] || null;
  }

  static async create(data: Partial<Producto>): Promise<Producto> {
    const db = getDatabase();
    const result = await db.query(
      `INSERT INTO productos (empresa_id, nombre, sku, descripcion, precio, stock, stock_minimo, proveedor_id, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [data.empresa_id, data.nombre, data.sku, data.descripcion, data.precio, data.stock ?? 0, data.stock_minimo ?? 0, data.proveedor_id, data.activo ?? true],
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<Producto>): Promise<Producto | null> {
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
      `UPDATE productos SET ${fields.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} AND deleted_at IS NULL 
       RETURNING *`,
      values,
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<void> {
    const db = getDatabase();
    await db.query('UPDATE productos SET deleted_at = NOW() WHERE id = $1', [id]);
  }

  static async updateStock(id: number, cantidad: number): Promise<void> {
    const db = getDatabase();
    await db.query(
      'UPDATE productos SET stock = stock + $1, updated_at = NOW() WHERE id = $2',
      [cantidad, id],
    );
  }
}
