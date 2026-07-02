import React, { useState } from 'react';
import { Palette, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getContrastColor,
  applyTheme,
  type ThemeConfig,
} from '../../services/themeService';

interface Props {
  initialTheme?: ThemeConfig;
  onSave?: (config: ThemeConfig) => void;
}

export const PersonalizacionTab: React.FC<Props> = ({ initialTheme, onSave }) => {
  const [nombreSistema, setNombreSistema] = useState(
    initialTheme?.nombre_sistema ?? 'ERP V3.0'
  );
  const [tema, setTema] = useState<'claro' | 'oscuro' | 'auto'>(
    initialTheme?.tema ?? 'claro'
  );
  const [fuente, setFuente] = useState<
    'inter' | 'roboto' | 'arial' | 'segoe' | 'helvetica'
  >(initialTheme?.fuente ?? 'inter');
  const [colorPrimario,   setColorPrimario]   = useState(initialTheme?.colorPrimario   ?? '#2563eb');
  const [colorSecundario, setColorSecundario] = useState(initialTheme?.colorSecundario ?? '#1e40af');
  const [colorMenu,       setColorMenu]       = useState(initialTheme?.colorMenu       ?? '#1e3a8a');
  const [loading, setLoading] = useState(false);

  const buildConfig = (): ThemeConfig => ({
    nombre_sistema: nombreSistema,
    tema,
    fuente,
    colorPrimario,
    colorSecundario,
    colorMenu,
  });

  const preview = (patch: Partial<ThemeConfig>) =>
    applyTheme({ ...buildConfig(), ...patch });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = buildConfig();
      localStorage.setItem('erp_personalizacion', JSON.stringify(config));
      applyTheme(config);
      onSave?.(config);
      toast.success('✨ Personalización guardada');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Palette size={24} />
        Personalización del Sistema
      </h2>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Sistema
            </label>
            <input
              type="text"
              value={nombreSistema}
              onChange={(e) => setNombreSistema(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
            <select
              value={tema}
              onChange={(e) => {
                const v = e.target.value as 'claro' | 'oscuro' | 'auto';
                setTema(v);
                preview({ tema: v });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="claro">☀️ Claro</option>
              <option value="oscuro">🌙 Oscuro</option>
              <option value="auto">🔄 Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuente</label>
            <select
              value={fuente}
              onChange={(e) => {
                const v = e.target.value as typeof fuente;
                setFuente(v);
                preview({ fuente: v });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="arial">Arial</option>
              <option value="segoe">Segoe UI</option>
              <option value="helvetica">Helvetica</option>
            </select>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Color rows */}
        {(
          [
            { label: 'Color Primario',   value: colorPrimario,   set: setColorPrimario,   key: 'colorPrimario'   },
            { label: 'Color Secundario', value: colorSecundario, set: setColorSecundario, key: 'colorSecundario' },
            { label: 'Color del Menú',   value: colorMenu,       set: setColorMenu,       key: 'colorMenu'       },
          ] as const
        ).map(({ label, value, set, key }) => (
          <div key={key}>
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm font-bold text-gray-700">{label}</label>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                Contraste: {getContrastColor(value) === '#ffffff' ? '⚪ Blanco' : '⚫ Negro'}
              </span>
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              <input
                type="color"
                value={value}
                onChange={(e) => {
                  set(e.target.value);
                  preview({ [key]: e.target.value });
                }}
                className="w-20 h-12 rounded cursor-pointer border-2 border-gray-300"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  set(e.target.value);
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    preview({ [key]: e.target.value });
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                style={{ width: '140px' }}
              />
              <div
                className="px-8 py-3 rounded-lg font-semibold text-sm"
                style={{ backgroundColor: value, color: getContrastColor(value) }}
              >
                Vista Previa
              </div>
            </div>
          </div>
        ))}

        {/* Info */}
        <div className="bg-blue-50 p-4 rounded-lg flex gap-3 border border-blue-200">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-700">
            <p className="font-semibold">Contraste Automático en Tiempo Real</p>
            <p className="mt-1">
              Los cambios se aplican instantáneamente. El contraste se ajusta automáticamente.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? 'Guardando...' : 'Guardar Personalización'}
        </button>
      </form>
    </div>
  );
};
