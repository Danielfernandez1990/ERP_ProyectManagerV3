import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-blue-600">ERP V3.0</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            {user?.rol}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <User size={20} />
            <span className="font-medium">{user?.nombre}</span>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
