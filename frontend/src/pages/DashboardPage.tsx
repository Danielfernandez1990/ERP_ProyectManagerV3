import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { usuariosApi, clientesApi, productosApi, licenciasApi } from '../services/api';
import { Users, Package, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

interface DashboardStats {
  usuariosCount: number;
  clientesCount: number;
  productosCount: number;
  licenciaStatus: any;
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usuarios, clientes, productos, licencia] = await Promise.all([
          usuariosApi.getAll(),
          clientesApi.getAll(),
          productosApi.getAll(),
          licenciasApi.getEmpresa(),
        ]);

        setStats({
          usuariosCount: usuarios.data.data.length,
          clientesCount: clientes.data.data.length,
          productosCount: productos.data.data.length,
          licenciaStatus: licencia.data.data,
        });
      } catch (error) {
        toast.error('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Usuarios */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Usuarios Activos</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.usuariosCount || 0}</p>
              </div>
              <Users className="text-blue-500" size={40} />
            </div>
          </div>

          {/* Card Clientes */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.clientesCount || 0}</p>
              </div>
              <Users className="text-green-500" size={40} />
            </div>
          </div>

          {/* Card Productos */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Productos</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.productosCount || 0}</p>
              </div>
              <Package className="text-orange-500" size={40} />
            </div>
          </div>

          {/* Card Licencia */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Plan</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.licenciaStatus?.plan}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats?.licenciaStatus?.usuarios_activos}/{stats?.licenciaStatus?.usuarios_max} usuarios
                </p>
              </div>
              <FileText className="text-purple-500" size={40} />
            </div>
          </div>
        </div>

        {/* License Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Licencia</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Plan Actual</p>
              <p className="text-xl font-bold text-gray-900">{stats?.licenciaStatus?.plan}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Estado</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  stats?.licenciaStatus?.estado === 'activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {stats?.licenciaStatus?.estado === 'activo' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Usuarios Máximos</p>
              <p className="text-xl font-bold text-gray-900">{stats?.licenciaStatus?.usuarios_max}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Vencimiento</p>
              <p className="text-xl font-bold text-gray-900">
                {new Date(stats?.licenciaStatus?.fecha_expiracion).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
