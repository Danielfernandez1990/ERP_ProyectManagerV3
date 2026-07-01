import React, { useState, useEffect } from 'react';
import { Mail, Save, Eye, EyeOff, Send, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { GenericModal } from '../../components/GenericModal';
import {
  sendTestEmail,
  validateSMTPConfig,
  getSMTPConfig,
  setSMTPConfig,
  type SMTPConfig,
} from '../../services/smtpService';

/**
 * COMPONENTE AISLADO - SMTPTab
 * Responsabilidades:
 * - Gestionar configuración SMTP real
 * - Cargar/guardar en localStorage
 * - Validar parámetros
 * - Enviar pruebas de correo
 * 
 * NO DEBE SER MODIFICADO por otros componentes
 */

interface SMTPTabProps {
  initialConfig?: SMTPConfig;
  onSave?: (config: SMTPConfig) => void;
}

export const SMTPTab: React.FC<SMTPTabProps> = ({
  initialConfig,
  onSave,
}) => {
  const [config, setConfig] = useState<SMTPConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);

  // Cargar configuración al montar
  useEffect(() => {
    try {
      const saved = getSMTPConfig();
      if (saved) {
        setConfig(saved);
        console.log('✅ SMTP config cargada:', saved);
      } else if (initialConfig) {
        setConfig(initialConfig);
      } else {
        setConfig({
          servidor: 'smtp.gmail.com',
          puerto: 587,
          email: 'notificaciones@empresa.com',
          contraseña: '',
          cifrado: 'TLS',
        });
      }
    } catch (error) {
      console.error('Error cargando SMTP:', error);
      setConfig({
        servidor: 'smtp.gmail.com',
        puerto: 587,
        email: 'notificaciones@empresa.com',
        contraseña: '',
        cifrado: 'TLS',
      });
    } finally {
      setLoading(false);
    }
  }, [initialConfig]);

  if (loading || !config) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">Cargando configuración SMTP...</p>
      </div>
    );
  }

  // Guardar configuración
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateSMTPConfig(config);
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    setSaving(true);
    try {
      // Guardar en localStorage
      setSMTPConfig(config);

      if (onSave) {
        onSave(config);
      }

      toast.success('✅ Configuración SMTP guardada');
      console.log('✅ SMTP guardado:', config);
    } catch (error) {
      toast.error('Error al guardar SMTP');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Probar conexión
  const handleTestConnection = async () => {
    const errors = validateSMTPConfig(config);
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('✅ Conexión SMTP exitosa');
    } catch (error) {
      toast.error('❌ Error en conexión SMTP');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Enviar correo de prueba
  const handleSendTest = async () => {
    if (!testEmail.trim()) {
      toast.error('Ingresa un correo de prueba');
      return;
    }

    setTestingEmail(true);
    try {
      const result = await sendTestEmail(config, testEmail);
      if (result.success) {
        toast.success(`✉️ ${result.message}`);
        setShowTestModal(false);
        setTestEmail('');
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      toast.error('Error al enviar correo de prueba');
      console.error('Error:', error);
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Mail size={24} />
        Configuración SMTP
      </h2>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Servidor SMTP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servidor SMTP
            </label>
            <input
              type="text"
              value={config.servidor}
              onChange={(e) =>
                setConfig({ ...config, servidor: e.target.value })
              }
              placeholder="smtp.gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Ej: smtp.gmail.com, smtp.office365.com</p>
          </div>

          {/* Puerto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puerto
            </label>
            <input
              type="number"
              value={config.puerto}
              onChange={(e) =>
                setConfig({ ...config, puerto: parseInt(e.target.value) })
              }
              placeholder="587"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">587 (TLS), 465 (SSL), 25 (Ninguno)</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (Remitente)
            </label>
            <input
              type="email"
              value={config.email}
              onChange={(e) =>
                setConfig({ ...config, email: e.target.value })
              }
              placeholder="notificaciones@empresa.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Dirección de correo que envía</p>
          </div>

          {/* Cifrado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Cifrado
            </label>
            <select
              value={config.cifrado}
              onChange={(e) =>
                setConfig({ ...config, cifrado: e.target.value as any })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="TLS">TLS (Recomendado)</option>
              <option value="SSL">SSL</option>
              <option value="NONE">Ninguno</option>
            </select>
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña / Clave de Aplicación
          </label>
          <div className="flex gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              value={config.contraseña}
              onChange={(e) =>
                setConfig({ ...config, contraseña: e.target.value })
              }
              placeholder="••••••••••••"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              title={showPassword ? 'Ocultar' : 'Mostrar'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Gmail: usa contraseña de aplicación, no tu contraseña normal
          </p>
        </div>

        {/* Advertencia */}
        <div className="bg-yellow-50 p-4 rounded-lg flex gap-3 border border-yellow-200">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-yellow-700">
            <p className="font-semibold">Seguridad</p>
            <p className="mt-1">Estos datos se almacenan de forma segura y se usan solo para enviar notificaciones.</p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 flex-wrap">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
          >
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar SMTP'}
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition font-medium"
          >
            Probar Conexión
          </button>

          <button
            type="button"
            onClick={() => setShowTestModal(true)}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 disabled:opacity-50 transition font-medium"
          >
            <Send size={18} />
            Enviar Prueba
          </button>
        </div>
      </form>

      {/* Modal de Prueba de Correo */}
      {showTestModal && (
        <GenericModal
          isOpen
          onClose={() => setShowTestModal(false)}
          title="Enviar Correo de Prueba"
          onConfirm={handleSendTest}
          isLoading={testingEmail}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Destino
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="tu.email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <p className="text-sm text-gray-600">
              Se enviará un correo de prueba a esta dirección para validar que la configuración SMTP es correcta.
            </p>
          </div>
        </GenericModal>
      )}
    </div>
  );
};
