import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface GenericTableProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  onEdit: (row: T) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

/**
 * Tabla genérica reutilizable
 * 
 * Uso:
 * <GenericTable
 *   data={usuarios}
 *   columns={[
 *     { key: 'email', label: 'Email' },
 *     { key: 'nombre', label: 'Nombre' },
 *     { key: 'rol', label: 'Rol' },
 *   ]}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 */
export function GenericTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  isLoading = false,
}: GenericTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay datos para mostrar
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-200 hover:bg-blue-50 transition"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-6 py-4 text-sm text-gray-700"
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key])}
                </td>
              ))}
              <td className="px-6 py-4 text-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(row)}
                    disabled={isLoading}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition disabled:opacity-50"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(row.id)}
                    disabled={isLoading}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition disabled:opacity-50"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
