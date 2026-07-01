import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { joinProjectRoom, sendMessage, onNewMessage } from '../services/socket';
import { Send } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface Message {
  id: number;
  usuario_id: number;
  mensaje: string;
  timestamp: Date;
  usuarioNombre?: string;
}

export const ChatPage: React.FC = () => {
  const { user } = useAuthStore();
  const [projectId, setProjectId] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    joinProjectRoom(projectId);

    const handleNewMessage = (data: any) => {
      setMessages((prev) => [...prev, data]);
    };

    onNewMessage(handleNewMessage);

    return () => {
      // Cleanup listeners
    };
  }, [projectId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    sendMessage(projectId, newMessage, user.id);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        usuario_id: user.id,
        mensaje: newMessage,
        timestamp: new Date(),
        usuarioNombre: user.nombre,
      },
    ]);
    setNewMessage('');
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Chat en Tiempo Real</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* Chat Messages */}
          <div className="col-span-2 bg-white rounded-lg shadow p-6 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.usuario_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.usuario_id === user?.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.usuario_id !== user?.id && (
                      <p className="text-sm font-semibold">{msg.usuarioNombre}</p>
                    )}
                    <p>{msg.mensaje}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Proyecto ID</p>
                <p className="text-lg font-bold">{projectId}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tu nombre</p>
                <p className="text-lg font-bold">{user?.nombre}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Mensajes</p>
                <p className="text-lg font-bold">{messages.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
