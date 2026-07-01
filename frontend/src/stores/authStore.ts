import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  empresa_id: number;
}

export interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  getAuthHeader: () => { Authorization: string } | {};
}

export const useAuthStore = create<AuthStore>((set) => {
  // Recuperar tokens del localStorage al iniciar
  const accessToken = Cookies.get('accessToken') || null;
  const refreshToken = Cookies.get('refreshToken') || null;

  return {
    user: null,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,

    login: (user, accessToken, refreshToken) => {
      Cookies.set('accessToken', accessToken, { expires: 7 });
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    },

    logout: () => {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    },

    setTokens: (accessToken, refreshToken) => {
      Cookies.set('accessToken', accessToken, { expires: 7 });
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
      set({ accessToken, refreshToken });
    },

    getAuthHeader: () => {
      const token = Cookies.get('accessToken');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
  };
});
