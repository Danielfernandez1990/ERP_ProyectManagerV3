import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from '../components/Layout';
import { GenericTable } from '../components/GenericTable';
import { GenericModal } from '../components/GenericModal';
import { usuariosApi } from '../services/api';
import { toast } from 'react-toastify';

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido?: string;
  rol: string;
  estado: string;
}

interface UsuarioFormData {
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  password?: string;
}

/**
 * Página de Gestión de Usuarios
 * CRUD completo: Create, Read, Update, Delete
 */
export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UsuarioFormData>({
    email: '',
    nombre: '',
    apellido: '',
    rol: 'OPERARIO',
    password: '',
  });

  // Cargar usuarios
  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await usuariosApi.getAll();
      setUsuarios(response.data.data || []);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      email: '',
      nombre: '',
      apellido: '',
      rol: 'OPERARIO',
      password: '',
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setFormData({
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido || '',
      rol: usuario.rol,
    });
    setIsModalOpen(true);
  };

  // Guardar (crear o actualizar)
  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (editingId) {
        await usuariosApi.update(editingId, formData);
        toast.success('Usuario actualizado');
      } else {
        await usuariosApi.create(formData);
        toast.success('Usuario creado');
      }
      setIsModalOpen(false);
      await loadUsuarios();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      setIsLoading(true);
      await usuariosApi.delete(id);
      toast.success('Usuario eliminado');
      await loadUsuarios();
    } catch (error) {
      toast.error('Error al eliminar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={20} />
            Nuevo Usuario
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow">
          <GenericTable
            data={usuarios}
            columns={[
              { key: 'email', label: 'Email' },
              { key: 'nombre', label: 'Nombre' },
              { key: 'apellido', label: 'Apellido' },
              { key: 'rol', label: 'Rol' },
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
          title={editingId ? 'Editar Usuario' : 'Crear Usuario'}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSave}
          isLoading={isLoading}
        >
          <form className="space-y-4">
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
                disabled={editingId !== null}
              />
            </div>

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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                value={formData.rol}
                onChange={(e) =>
                  setFormData({ ...formData, rol: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="OPERARIO">Operario</option>
                <option value="VISUALIZADOR">Visualizador</option>
              </select>
            </div>

            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </form>
        </GenericModal>
      </div>
    </Layout>
  );
};
