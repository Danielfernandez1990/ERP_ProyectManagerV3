import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { PersonalizacionTab } from './settings-components/PersonalizacionTab';
import { SMTPTab } from './settings-components/SMTPTab';
import { getThemeConfig, type ThemeConfig } from '../services/themeService';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('personalizacion');
  const [personalizacion, setPersonalizacion] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const config = getThemeConfig();
      setPersonalizacion(config);
    } catch (error) {
      console.error('Error cargando tema:', error);
      setPersonalizacion({
        tema: 'claro',
        colorPrimario: '#2563eb',
        colorSecundario: '#1e40af',
        colorMenu: '#1e3a8a',
        nombre_sistema: 'ERP V3.0',
        fuente: 'inter',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'empresa',        label: '📋 Empresa' },
    { id: 'admin',          label: '👤 Admins' },
    { id: 'smtp',           label: '📧 SMTP' },
    { id: 'licencia',       label: '🔑 Licencias' },
    { id: 'personalizacion',label: '🎨 Personalización' },
    { id: 'audit',          label: '📊 Auditoría' },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 font-medium transition whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'personalizacion' && personalizacion && (
          <PersonalizacionTab initialTheme={personalizacion} />
        )}
        {activeTab === 'smtp' && <SMTPTab />}

        {['empresa', 'admin', 'licencia', 'audit'].includes(activeTab) && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="text-center py-12 text-gray-500">Próximamente...</div>
          </div>
        )}
      </div>
    </Layout>
  );
};
