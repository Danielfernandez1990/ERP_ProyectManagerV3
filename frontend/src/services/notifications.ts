// notifications.ts - Firebase Push Notifications
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || '',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '',
};

let messaging: ReturnType<typeof getMessaging> | null = null;

try {
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  }
} catch (e) {
  console.warn('Firebase no configurado, notificaciones push deshabilitadas');
}

export const initNotifications = async () => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const vapidKey = (import.meta as any).env?.VITE_FIREBASE_VAPID_KEY || '';
      const token = await getToken(messaging, { vapidKey });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
  return null;
};

export const setupNotificationListener = (callback: (payload: any) => void) => {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    callback(payload);
  });
};

export { messaging };
