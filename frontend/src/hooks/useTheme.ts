/**
 * Hook para suscribirse a cambios de tema
 * Aplica cambios en tiempo real
 */

import { useEffect } from 'react';
import { applyTheme, type ThemeConfig } from '../services/themeService';

export const useTheme = (config: ThemeConfig) => {
  useEffect(() => {
    applyTheme(config);
  }, [config.tema, config.colorPrimario, config.colorSecundario, config.fuente]);
};
