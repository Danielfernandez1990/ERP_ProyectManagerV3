import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { initApiClient } from './services/api';
import { initSocket } from './services/socket';
import { initTheme } from './services/themeService';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { ClientesPage } from './pages/ClientesPage';
import { ProductosPage } from './pages/ProductosPage';
import { ProyectosPage } from './pages/ProyectosPage';
import { ChatPage } from './pages/ChatPage';
import { KanbanPage } from './pages/KanbanPage';
import { SettingsPage } from './pages/SettingsPage';

initApiClient();
initSocket();
initTheme();

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><UsuariosPage /></ProtectedRoute>} />
      <Route path="/clientes" element={<ProtectedRoute><ClientesPage /></ProtectedRoute>} />
      <Route path="/productos" element={<ProtectedRoute><ProductosPage /></ProtectedRoute>} />
      <Route path="/proyectos" element={<ProtectedRoute><ProyectosPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/kanban" element={<ProtectedRoute><KanbanPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      draggable
      pauseOnHover
    />
  </Router>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
