import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from '../components/Layout';
import { GenericTable } from '../components/GenericTable';
import { GenericModal } from '../components/GenericModal';
import { toast } from 'react-toastify';

interface Proyecto {
  id: number;
  nombre: string;
  descripcion?: string;
  cliente_id?: number;
  estado: string;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  presupuesto?: number;
}

interface ProyectoFormData {
  nombre: string;
  descripcion: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  presupuesto: string;
}

/**
 * Página de Gestión de Proyectos
 * CRUD completo: Create, Read, Update, Delete
 */
export const ProyectosPage: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProyectoFormData>({
    nombre: '',
    descripcion: '',
    estado: 'pendiente',
    fecha_inicio: '',
    fecha_fin_estimada: '',
    presupuesto: '',
  });

  // Cargar proyectos (usando datos mock por ahora)
  useEffect(() => {
    loadProyectos();
  }, []);

  const loadProyectos = async () => {
    try {
      setIsLoading(true);
      // TODO: Reemplazar con llamada real a la API
      // const response = await proyectosApi.getAll();
      // setProyectos(response.data.data || []);
      
      // Mock data por ahora
      setProyectos([
        {
          id: 1,
          nombre: 'Sitio Web Corporativo',
          descripcion: 'Desarrollo de sitio web responsivo',
          estado: 'en_progreso',
          fecha_inicio: '2026-01-01',
          fecha_fin_estimada: '2026-03-01',
          presupuesto: 5000,
        },
        {
          id: 2,
          nombre: 'App Móvil',
          descripcion: 'Aplicación móvil para iOS y Android',
          estado: 'pendiente',
          fecha_inicio: '2026-02-01',
          fecha_fin_estimada: '2026-06-01',
          presupuesto: 15000,
        },
      ]);
    } catch (error) {
      toast.error('Error al cargar proyectos');
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      nombre: '',
      descripcion: '',
      estado: 'pendiente',
      fecha_inicio: '',
      fecha_fin_estimada: '',
      presupuesto: '',
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (proyecto: Proyecto) => {
    setEditingId(proyecto.id);
    setFormData({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion || '',
      estado: proyecto.estado,
      fecha_inicio: proyecto.fecha_inicio || '',
      fecha_fin_estimada: proyecto.fecha_fin_estimada || '',
      presupuesto: proyecto.presupuesto?.toString() || '',
    });
    setIsModalOpen(true);
  };

  // Guardar (crear o actualizar)
  const handleSave = async () => {
    try {
      setIsLoading(true);
      // TODO: Implementar llamadas reales a la API
      // if (editingId) {
      //   await proyectosApi.update(editingId, formData);
      //   toast.success('Proyecto actualizado');
      // } else {
      //   await proyectosApi.create(formData);
      //   toast.success('Proyecto creado');
      // }
      
      // Mock: agregar/actualizar localmente
      if (editingId) {
        setProyectos(
          proyectos.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  nombre: formData.nombre,
                  descripcion: formData.descripcion,
                  estado: formData.estado,
                  presupuesto: parseFloat(formData.presupuesto),
                }
              : p,
          ),
        );
        toast.success('Proyecto actualizado');
      } else {
        const newProyecto: Proyecto = {
          id: Math.max(...proyectos.map((p) => p.id), 0) + 1,
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          estado: formData.estado,
          fecha_inicio: formData.fecha_inicio,
          fecha_fin_estimada: formData.fecha_fin_estimada,
          presupuesto: parseFloat(formData.presupuesto),
        };
        setProyectos([...proyectos, newProyecto]);
        toast.success('Proyecto creado');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este proyecto?')) return;

    try {
      setIsLoading(true);
      // TODO: Implementar llamada real a la API
      // await proyectosApi.delete(id);
      
      // Mock: eliminar localmente
      setProyectos(proyectos.filter((p) => p.id !== id));
      toast.success('Proyecto eliminado');
    } catch (error) {
      toast.error('Error al eliminar proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Proyectos</h1>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={20} />
            Nuevo Proyecto
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow">
          <GenericTable
            data={proyectos}
            columns={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'descripcion', label: 'Descripción' },
              {
                key: 'presupuesto',
                label: 'Presupuesto',
                render: (value) => `$${parseFloat(value || 0).toFixed(2)}`,
              },
              {
                key: 'estado',
                label: 'Estado',
                render: (value) => (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      value === 'en_progreso'
                        ? 'bg-yellow-100 text-yellow-800'
                        : value === 'completado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {value === 'en_progreso' ? 'En Progreso' : value === 'completado' ? 'Completado' : 'Pendiente'}
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
          title={editingId ? 'Editar Proyecto' : 'Crear Proyecto'}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completado">Completado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_inicio: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin Estimada
              </label>
              <input
                type="date"
                value={formData.fecha_fin_estimada}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_fin_estimada: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presupuesto
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.presupuesto}
                onChange={(e) =>
                  setFormData({ ...formData, presupuesto: e.target.value })
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
