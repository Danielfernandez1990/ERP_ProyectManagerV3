import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, Package, Briefcase, CheckSquare, Mail, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { label: 'Usuarios', path: '/usuarios', icon: Users },
    { label: 'Clientes', path: '/clientes', icon: Users },
    { label: 'Productos', path: '/productos', icon: Package },
    { label: 'Proyectos', path: '/proyectos', icon: Briefcase },
    { label: 'Tareas (Kanban)', path: '/kanban', icon: CheckSquare },
    { label: 'Chat', path: '/chat', icon: Mail },
    { label: 'Configuración', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto pt-20">
      <nav className="p-4 space-y-2">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
