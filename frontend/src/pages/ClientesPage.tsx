import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from '../components/Layout';
import { GenericTable } from '../components/GenericTable';
import { GenericModal } from '../components/GenericModal';
import { clientesApi } from '../services/api';
import { toast } from 'react-toastify';

interface Cliente {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  estado_cliente: string;
}

interface ClienteFormData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}

/**
 * Página de Gestión de Clientes
 * CRUD completo: Create, Read, Update, Delete
 */
export const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ClienteFormData>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
  });

  // Cargar clientes
  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setIsLoading(true);
      const response = await clientesApi.getAll();
      setClientes(response.data.data || []);
    } catch (error) {
      toast.error('Error al cargar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (cliente: Cliente) => {
    setEditingId(cliente.id);
    setFormData({
      nombre: cliente.nombre,
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      ciudad: cliente.ciudad || '',
    });
    setIsModalOpen(true);
  };

  // Guardar (crear o actualizar)
  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (editingId) {
        await clientesApi.update(editingId, formData);
        toast.success('Cliente actualizado');
      } else {
        await clientesApi.create(formData);
        toast.success('Cliente creado');
      }
      setIsModalOpen(false);
      await loadClientes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar cliente');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este cliente?')) return;

    try {
      setIsLoading(true);
      await clientesApi.delete(id);
      toast.success('Cliente eliminado');
      await loadClientes();
    } catch (error) {
      toast.error('Error al eliminar cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={20} />
            Nuevo Cliente
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow">
          <GenericTable
            data={clientes}
            columns={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'email', label: 'Email' },
              { key: 'telefono', label: 'Teléfono' },
              { key: 'ciudad', label: 'Ciudad' },
              {
                key: 'estado_cliente',
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
          title={editingId ? 'Editar Cliente' : 'Crear Cliente'}
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
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) =>
                  setFormData({ ...formData, ciudad: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </GenericModal>
      </div>
    </Layout>
  );
};
