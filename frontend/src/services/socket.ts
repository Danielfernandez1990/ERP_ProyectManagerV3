// socket.ts - WebSocket client
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export const initSocket = () => {
  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => console.log('Socket connected:', socket?.id));
  socket.on('disconnect', () => console.log('Socket disconnected'));

  return socket;
};

export const getSocket = (): Socket | null => {
  if (!socket) initSocket();
  return socket;
};

export const joinProjectRoom = (projectId: number) => {
  getSocket()?.emit('join_project', projectId);
};

export const sendMessage = (projectId: number, mensaje: string, usuarioId: number) => {
  getSocket()?.emit('send_message', {
    projectId,
    mensaje,
    usuarioId,
    timestamp: new Date(),
  });
};

export const onNewMessage = (callback: (data: any) => void) => {
  getSocket()?.on('new_message', callback);
};

export const onTaskUpdate = (callback: (data: any) => void) => {
  getSocket()?.on('task_updated', callback);
};
