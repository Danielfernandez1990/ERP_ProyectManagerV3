import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { PersonalizacionTab } from './settings-components/PersonalizacionTab';
import { SMTPTab } from './settings-components/SMTPTab';
import { getThemeConfig, type ThemeConfig } from '../services/themeService';

/**
 * SettingsPage - Página Principal de Configuración
 * 
 * Esta página orquesta los diferentes tabs de configuración.
 * Cada tab es un componente AISLADO que no interfiere con otros.
 * 
 * Tabs disponibles:
 * - 📋 Empresa
 * - 👤 Admins
 * - 📧 SMTP (COMPONENTE AISLADO)
 * - 🔑 Licencias
 * - 🎨 Personalización (COMPONENTE AISLADO)
 * - 📊 Auditoría
 */

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('personalizacion');
  const [personalizacion, setPersonalizacion] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const config = getThemeConfig();
      console.log('✅ Tema cargado:', config);
      setPersonalizacion(config);
    } catch (error) {
      console.error('❌ Error cargando tema:', error);
      // Usar configuración por defecto
      const defaultConfig: ThemeConfig = {
        tema: 'claro',
        colorPrimario: '#2563eb',
        colorSecundario: '#1e40af',
        nombre_sistema: 'ERP V3.0',
        fuente: 'inter',
      };
      setPersonalizacion(defaultConfig);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <p className="text-gray-500">Cargando configuración...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'empresa', label: '📋 Empresa' },
            { id: 'admin', label: '👤 Admins' },
            { id: 'smtp', label: '📧 SMTP' },
            { id: 'licencia', label: '🔑 Licencias' },
            { id: 'personalizacion', label: '🎨 Personalización' },
            { id: 'audit', label: '📊 Auditoría' },
          ].map((tab) => (
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

        {/* Content - Personalización */}
        {activeTab === 'personalizacion' && personalizacion && (
          <PersonalizacionTab initialTheme={personalizacion} />
        )}

        {/* Content - SMTP */}
        {activeTab === 'smtp' && (
          <SMTPTab />
        )}

        {/* Content - Otros tabs (Placeholders) */}
        {activeTab === 'empresa' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Configuración de Empresa</h2>
            <div className="text-center py-12 text-gray-500">
              Próximamente...
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Super Admins</h2>
            <div className="text-center py-12 text-gray-500">
              Próximamente...
            </div>
          </div>
        )}

        {activeTab === 'licencia' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Licencias</h2>
            <div className="text-center py-12 text-gray-500">
              Próximamente...
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Auditoría</h2>
            <div className="text-center py-12 text-gray-500">
              Próximamente...
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
