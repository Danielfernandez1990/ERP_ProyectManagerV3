import React, { useState } from 'react';
import { Palette, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { getContrastColor, applyTheme, type ThemeConfig } from '../../services/themeService';

export const PersonalizacionTab: React.FC<{ initialTheme?: ThemeConfig; onSave?: (config: ThemeConfig) => void }> = ({
  initialTheme,
  onSave,
}) => {
  const [nombreSistema, setNombreSistema] = useState(initialTheme?.nombre_sistema || 'ERP V3.0');
  const [tema, setTema] = useState(initialTheme?.tema || 'claro');
  const [fuente, setFuente] = useState(initialTheme?.fuente || 'inter');
  const [colorPrimario, setColorPrimario] = useState(initialTheme?.colorPrimario || '#2563eb');
  const [colorSecundario, setColorSecundario] = useState(initialTheme?.colorSecundario || '#1e40af');
  const [colorMenu, setColorMenu] = useState(initialTheme?.colorMenu || '#1e3a8a');
  const [loading, setLoading] = useState(false);

  const contrastePrimario = getContrastColor(colorPrimario);
  const contrasteSecundario = getContrastColor(colorSecundario);
  const contrasteMenu = getContrastColor(colorMenu);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalConfig: ThemeConfig = {
        nombre_sistema: nombreSistema,
        tema: tema as any,
        fuente: fuente as any,
        colorPrimario,
        colorSecundario,
        colorMenu,
      };

      localStorage.setItem('erp_personalizacion', JSON.stringify(finalConfig));
      applyTheme(finalConfig);
      if (onSave) onSave(finalConfig);

      toast.success('✨ Personalización guardada');
    } catch (error) {
      console.error('Error:', error);
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
        {/* ROW 1: Nombre, Tema, Fuente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Sistema</label>
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
                setTema(e.target.value);
                applyTheme({
                  nombre_sistema: nombreSistema,
                  tema: e.target.value as any,
                  fuente: fuente as any,
                  colorPrimario,
                  colorSecundario,
                  colorMenu,
                });
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
                setFuente(e.target.value);
                applyTheme({
                  nombre_sistema: nombreSistema,
                  tema: tema as any,
                  fuente: e.target.value as any,
                  colorPrimario,
                  colorSecundario,
                  colorMenu,
                });
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

        {/* COLOR PRIMARIO */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm font-bold text-gray-700">Color Primario</label>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              Contraste: {contrastePrimario === '#ffffff' ? '⚪ Blanco' : '⚫ Negro'}
            </span>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            <input
              type="color"
              value={colorPrimario}
              onChange={(e) => {
                setColorPrimario(e.target.value);
                applyTheme({
                  nombre_sistema: nombreSistema,
                  tema: tema as any,
                  fuente: fuente as any,
                  colorPrimario: e.target.value,
                  colorSecundario,
                  colorMenu,
                });
              }}
              className="w-20 h-12 rounded cursor-pointer border-2 border-gray-300"
            />

            <input
              type="text"
              value={colorPrimario}
              onChange={(e) => {
                setColorPrimario(e.target.value);
                applyTheme({
                  nombre_sistema: nombreSistema,
                  tema: tema as any,
                  fuente: fuente as any,
                  colorPrimario: e.target.value,
                  colorSecundario,
                  colorMenu,
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              style={{ width: '150px' }}
            />

            <div
              className="px-8 py-3 rounded-lg font-semibold"
              style={{
                backgroundColor: colorPrimario,
                color: contrastePrimario,
              }}
            >
              Preview
            </div>
          </div>
        </div>

        {/* COLOR SECUNDARIO */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm font-bold text-gray-700">Color Secundario</label>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              Contraste: {contrasteSecundario === '#ffffff' ? '⚪ Blanco' : '⚫ Negro'}
            </span>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            <input
              type="color"
              value={colorSecundario}
              onChange={(e) => {
                setColorSecundario(e.target.value);
                applyTheme({
                  nombre_sistema: nombreSistema,
                  tema: tema as any,
                  fuente: fuente as any,
                  colorPrimario,
                  colorSecundario: e.target.value,
                  colorMenu,
                });
              }}
              className="w-20 h-12 rounded cursor-pointer border-2 border-gray-300"
            />

            <input
              type="text"
              value={colorSecundario}
              onChange={(e) => {
                setColorSecundario(e.target.value);
                applyTheme({
                  nombre_sistema: nombreSistema,
                  tema: tema as any,
                  fuente: fuente as any,
                  colorPrimario,
                  colorSecundario: e.target.value,
                  colorMenu,
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              style={{ width: '150px' }}
            />

            <div
              className="px-8 py-3 rounded-lg font-semibold"
              style={{
                backgroundColor: colorSecundario,
                color: contrasteSecundario,
              }}
            >
              Preview
            </div>
          </div>
        </div>

        {/* COLOR DEL MENÚ */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm font-bold text-gray-700">Color del Menú</label>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              Contraste: {contrasteMenu === '#ffffff' ? '⚪ Blanco' : '⚫ Negro'}
            </span>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            <input
              type="color"
              value={colorMenu}
              onChange={(e) => {
                setColorMenu(e.target.value);
                applyTheme({
                  nombre_sistema: nombreSistema,
                  tema: tema as any,
                  fuente: fuente as any,
                  colorPrimario,
                  colorSecundario,
                  colorMenu: e.target.value,
                });
              }}
              className="w-20 h-12 rounded cursor-pointer border-2 border-gray-300"
            />

            <input
              type="text"
              value={colorMenu}
              onChange={(e) => {
                setColorMenu(e.target.value);
                applyTheme({
                  nombre_sistema: nombreSistema,
                  tema: tema as any,
                  fuente: fuente as any,
                  colorPrimario,
                  colorSecundario,
                  colorMenu: e.target.value,
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              style={{ width: '150px' }}
            />

            <div
              className="px-8 py-3 rounded-lg font-semibold"
              style={{
                backgroundColor: colorMenu,
                color: contrasteMenu,
              }}
            >
              Preview Menú
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="bg-blue-50 p-4 rounded-lg flex gap-3 border border-blue-200">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-700">
            <p className="font-semibold">Contraste Automático en Tiempo Real</p>
            <p className="mt-1">Los cambios se aplican instantáneamente. El contraste se ajusta automáticamente según el color de fondo.</p>
          </div>
        </div>

        {/* BUTTON */}
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
