import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from '../components/Layout';
import { GenericTable } from '../components/GenericTable';
import { GenericModal } from '../components/GenericModal';
import { productosApi } from '../services/api';
import { toast } from 'react-toastify';

interface Producto {
  id: number;
  nombre: string;
  sku?: string;
  precio: number;
  cantidad_stock: number;
  descripcion?: string;
  estado: string;
}

interface ProductoFormData {
  nombre: string;
  sku: string;
  precio: string;
  cantidad_stock: string;
  descripcion: string;
}

/**
 * Página de Gestión de Productos
 * CRUD completo: Create, Read, Update, Delete
 */
export const ProductosPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: '',
    sku: '',
    precio: '',
    cantidad_stock: '',
    descripcion: '',
  });

  // Cargar productos
  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setIsLoading(true);
      const response = await productosApi.getAll();
      setProductos(response.data.data || []);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      nombre: '',
      sku: '',
      precio: '',
      cantidad_stock: '',
      descripcion: '',
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (producto: Producto) => {
    setEditingId(producto.id);
    setFormData({
      nombre: producto.nombre,
      sku: producto.sku || '',
      precio: producto.precio.toString(),
      cantidad_stock: producto.cantidad_stock.toString(),
      descripcion: producto.descripcion || '',
    });
    setIsModalOpen(true);
  };

  // Guardar (crear o actualizar)
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const dataToSend = {
        nombre: formData.nombre,
        sku: formData.sku,
        precio: parseFloat(formData.precio),
        cantidad_stock: parseInt(formData.cantidad_stock),
        descripcion: formData.descripcion,
      };

      if (editingId) {
        await productosApi.update(editingId, dataToSend);
        toast.success('Producto actualizado');
      } else {
        await productosApi.create(dataToSend);
        toast.success('Producto creado');
      }
      setIsModalOpen(false);
      await loadProductos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar producto');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) return;

    try {
      setIsLoading(true);
      await productosApi.delete(id);
      toast.success('Producto eliminado');
      await loadProductos();
    } catch (error) {
      toast.error('Error al eliminar producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow">
          <GenericTable
            data={productos}
            columns={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'sku', label: 'SKU' },
              {
                key: 'precio',
                label: 'Precio',
                render: (value) => `$${parseFloat(value).toFixed(2)}`,
              },
              { key: 'cantidad_stock', label: 'Stock' },
              {
                key: 'estado',
                label: 'Estado',
                render: (value) => (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      value === 'activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {value}
                  </span>
                ),
              },
            ]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>

        {/* Modal */}
        <GenericModal
          isOpen={isModalOpen}
          title={editingId ? 'Editar Producto' : 'Crear Producto'}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSave}
          isLoading={isLoading}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad en Stock
              </label>
              <input
                type="number"
                value={formData.cantidad_stock}
                onChange={(e) =>
                  setFormData({ ...formData, cantidad_stock: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </form>
        </GenericModal>
      </div>
    </Layout>
  );
};
