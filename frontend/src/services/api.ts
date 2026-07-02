import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

let apiClient: AxiosInstance;

export const initApiClient = () => {
  apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { getAuthHeader } = useAuthStore.getState();
    const authHeader = getAuthHeader() as Record<string, string>;
    if (authHeader.Authorization) {
      config.headers.set('Authorization', authHeader.Authorization);
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        const { refreshToken, setTokens, logout } = useAuthStore.getState();
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
            const { access } = response.data.data;
            setTokens(access, refreshToken);
            return apiClient(error.config!);
          } catch {
            logout();
          }
        } else {
          logout();
        }
      }
      return Promise.reject(error);
    },
  );

  return apiClient;
};

export const getApiClient = (): AxiosInstance => {
  if (!apiClient) initApiClient();
  return apiClient;
};

export const authApi = {
  register: (data: { nombre: string; email: string; password: string; empresa_nombre: string }) =>
    getApiClient().post('/auth/register', data),
  login: (email: string, password: string) =>
    getApiClient().post('/auth/login', { email, password }),
  getMe: () => getApiClient().get('/auth/me'),
  refresh: (refreshToken: string) =>
    getApiClient().post('/auth/refresh', { refreshToken }),
};

export const usuariosApi = {
  getAll: () => getApiClient().get('/usuarios'),
  getById: (id: number) => getApiClient().get(`/usuarios/${id}`),
  create: (data: any) => getApiClient().post('/usuarios', data),
  update: (id: number, data: any) => getApiClient().put(`/usuarios/${id}`, data),
  delete: (id: number) => getApiClient().delete(`/usuarios/${id}`),
  updatePassword: (id: number, currentPassword: string, newPassword: string) =>
    getApiClient().put(`/usuarios/${id}/password`, { currentPassword, newPassword }),
};

export const clientesApi = {
  getAll: () => getApiClient().get('/clientes'),
  getById: (id: number) => getApiClient().get(`/clientes/${id}`),
  create: (data: any) => getApiClient().post('/clientes', data),
  update: (id: number, data: any) => getApiClient().put(`/clientes/${id}`, data),
  delete: (id: number) => getApiClient().delete(`/clientes/${id}`),
};

export const productosApi = {
  getAll: () => getApiClient().get('/productos'),
  getById: (id: number) => getApiClient().get(`/productos/${id}`),
  create: (data: any) => getApiClient().post('/productos', data),
  update: (id: number, data: any) => getApiClient().put(`/productos/${id}`, data),
  delete: (id: number) => getApiClient().delete(`/productos/${id}`),
};

export const licenciasApi = {
  getEmpresa: () => getApiClient().get('/licencias/empresa'),
  check: () => getApiClient().get('/licencias/check'),
  create: (data: any) => getApiClient().post('/licencias', data),
  update: (id: number, data: any) => getApiClient().put(`/licencias/${id}`, data),
};

export const adminApi = {
  emailTest: () => getApiClient().get('/admin/email/test'),
  sendTestEmail: (email: string) =>
    getApiClient().post('/admin/email/send-test', { email }),
  health: () => getApiClient().get('/admin/health'),
};
