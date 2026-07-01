/**
 * Servicio de Personalización - Temas, Colores, Fuentes, Menú
 * VERSIÓN CON VALIDACIÓN Y MENÚ PERSONALIZABLE
 */

export interface ThemeConfig {
  tema: 'claro' | 'oscuro' | 'auto';
  colorPrimario: string;
  colorSecundario: string;
  colorMenu: string;
  nombre_sistema: string;
  fuente: 'inter' | 'roboto' | 'arial' | 'segoe' | 'helvetica';
}

const DEFAULT_THEME: ThemeConfig = {
  tema: 'claro',
  colorPrimario: '#2563eb',
  colorSecundario: '#1e40af',
  colorMenu: '#1e3a8a',
  nombre_sistema: 'ERP V3.0',
  fuente: 'inter',
};

const STORAGE_KEY = 'erp_personalizacion';

/**
 * Calcula el color de contraste automático - CON VALIDACIÓN
 */
export const getContrastColor = (bgColor: string | undefined): string => {
  if (!bgColor || typeof bgColor !== 'string' || bgColor.length === 0) {
    return '#FFFFFF';
  }

  try {
    const hex = bgColor.replace('#', '').trim();
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      return '#FFFFFF';
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  } catch {
    return '#FFFFFF';
  }
};

/**
 * Obtener configuración de tema actual
 */
export const getThemeConfig = (): ThemeConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_THEME, ...parsed };
    }
    return DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

/**
 * Guardar configuración de tema
 */
export const saveThemeConfig = (config: ThemeConfig): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  applyTheme(config);
};

/**
 * Crear estilos CSS dinámicos
 */
const createThemeStyles = (
  isDark: boolean,
  colorPrimario: string,
  colorSecundario: string,
  colorMenu: string
): string => {
  const bgColor = isDark ? '#1a1a1a' : '#f5f5f5';
  const textColor = isDark ? '#ffffff' : '#000000';
  const textColorSecondary = isDark ? '#d0d0d0' : '#6b7280';
  const headerBg = isDark ? '#262626' : '#ffffff';
  const contrasteMenu = getContrastColor(colorMenu) || '#FFFFFF';

  return `
    html {
      background-color: ${bgColor} !important;
      color: ${textColor} !important;
    }

    body {
      background-color: ${bgColor} !important;
      color: ${textColor} !important;
    }

    * {
      color: ${textColor} !important;
    }

    .bg-gray-100 {
      background-color: ${bgColor} !important;
      color: ${textColor} !important;
    }

    .bg-white {
      background-color: ${isDark ? '#262626' : '#ffffff'} !important;
      color: ${textColor} !important;
    }

    .bg-blue-700,
    [class*="sidebar"],
    nav.bg-blue-700 {
      background-color: ${colorMenu} !important;
      color: ${contrasteMenu} !important;
    }

    .bg-blue-700 * {
      color: ${contrasteMenu} !important;
    }

    .bg-blue-700 button,
    nav.bg-blue-700 button {
      color: ${contrasteMenu} !important;
    }

    .bg-blue-700 button:hover,
    nav.bg-blue-700 button:hover {
      background-color: rgba(0, 0, 0, 0.2) !important;
      color: ${contrasteMenu} !important;
    }

    .border-blue-600 {
      border-color: ${colorMenu} !important;
    }

    .shadow-sm {
      background-color: ${headerBg} !important;
      color: ${textColor} !important;
    }

    h1, h2, h3, h4, h5, h6 {
      color: ${textColor} !important;
      font-weight: 700 !important;
    }

    p, span, div, a, li, td, th, label, button {
      color: ${textColor} !important;
    }

    .text-gray-600,
    .text-gray-700,
    .text-gray-500,
    .text-gray-400 {
      color: ${textColorSecondary} !important;
    }

    .text-gray-900 {
      color: ${textColor} !important;
    }

    .text-gray-300 {
      color: ${isDark ? '#b0b0b0' : '#d1d5db'} !important;
    }

    a {
      color: ${colorPrimario} !important;
    }

    a:hover {
      color: ${colorSecundario} !important;
    }

    input, select, textarea, button {
      background-color: ${isDark ? '#333333' : '#ffffff'} !important;
      color: ${textColor} !important;
      border-color: ${isDark ? '#555555' : '#d1d5db'} !important;
    }

    input::placeholder,
    textarea::placeholder {
      color: ${isDark ? '#888888' : '#999999'} !important;
      opacity: 1 !important;
    }

    .border-gray-200,
    .border-gray-300,
    .border-gray-400,
    .border-gray-100 {
      border-color: ${isDark ? '#444444' : '#e5e7eb'} !important;
    }

    table {
      color: ${textColor} !important;
      border-color: ${isDark ? '#444444' : '#e5e7eb'} !important;
    }

    tr, td, th {
      color: ${textColor} !important;
      border-color: ${isDark ? '#444444' : '#e5e7eb'} !important;
    }

    tbody tr:hover {
      background-color: ${isDark ? '#333333' : '#f9fafb'} !important;
    }

    .bg-blue-50 {
      background-color: ${isDark ? '#1e3a8a' : '#eff6ff'} !important;
    }

    .bg-red-50 {
      background-color: ${isDark ? '#7f1d1d' : '#fef2f2'} !important;
    }

    .bg-green-50 {
      background-color: ${isDark ? '#1f2937' : '#f0fdf4'} !important;
    }

    .bg-yellow-50 {
      background-color: ${isDark ? '#78350f' : '#fffbeb'} !important;
    }

    .text-blue-700 {
      color: ${colorPrimario} !important;
    }

    input:focus, select:focus, textarea:focus {
      outline-color: ${colorPrimario} !important;
      border-color: ${colorPrimario} !important;
    }

    ::-webkit-scrollbar {
      background-color: ${bgColor} !important;
    }

    ::-webkit-scrollbar-track {
      background-color: ${isDark ? '#262626' : '#f1f1f1'} !important;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${isDark ? '#666666' : '#888'} !important;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: ${isDark ? '#888888' : '#555'} !important;
    }
  `;
};

/**
 * Inyectar estilos CSS
 */
const injectThemeStyles = (css: string): void => {
  let styleEl = document.getElementById('erp-theme-styles');

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'erp-theme-styles';
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = css;
};

/**
 * Aplicar tema al DOM
 */
export const applyTheme = (config: ThemeConfig): void => {
  const root = document.documentElement;
  const body = document.body;

  let isDark = config.tema === 'oscuro';
  if (config.tema === 'auto') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  root.style.setProperty('--color-primary', config.colorPrimario || '#2563eb');
  root.style.setProperty('--color-secondary', config.colorSecundario || '#1e40af');
  root.style.setProperty('--color-menu', config.colorMenu || '#1e3a8a');

  if (isDark) {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }

  const css = createThemeStyles(
    isDark,
    config.colorPrimario || '#2563eb',
    config.colorSecundario || '#1e40af',
    config.colorMenu || '#1e3a8a'
  );
  injectThemeStyles(css);

  const fontFamily = getFontStack(config.fuente || 'inter');
  body.style.fontFamily = fontFamily;
  root.style.setProperty('--font-family', fontFamily);

  console.log('🎨 Tema aplicado');
};

/**
 * Obtener stack de fuentes
 */
export const getFontStack = (
  fontName: 'inter' | 'roboto' | 'arial' | 'segoe' | 'helvetica' | undefined
): string => {
  const fonts: Record<string, string> = {
    inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    roboto: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    arial: "'Arial', 'Helvetica Neue', sans-serif",
    segoe: "'Segoe UI', 'Trebuchet MS', sans-serif",
    helvetica: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  };
  return fonts[fontName || 'inter'] || fonts.inter;
};

/**
 * Inicializar tema
 */
export const initTheme = (): void => {
  const config = getThemeConfig();
  applyTheme(config);

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (config.tema === 'auto') {
        applyTheme(config);
      }
    });
};

/**
 * Resetear a tema por defecto
 */
export const resetTheme = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  applyTheme(DEFAULT_THEME);
};
