/**
 * Configuración de Supabase
 * 
 * Reemplaza PostgreSQL + Redis con Supabase
 * - Database: PostgreSQL alojado
 * - Auth: Supabase Auth
 * - Realtime: Para actualizaciones en tiempo real
 */

import { createClient } from '@supabase/supabase-js';

// Credenciales de Supabase (del .env)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gzgqhtgrbjbgrvhcestn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan credenciales de Supabase en .env');
  process.exit(1);
}

// Cliente de Supabase (para operaciones normales)
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Cliente con Service Role (para operaciones administrativas)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

/**
 * Tipos de tablas en Supabase
 */
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'SUPER_ADMIN' | 'ADMIN' | 'OPERARIO' | 'CLIENTE';
  estado: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';
  created_at: string;
  updated_at: string;
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'ABIERTO' | 'EN_PROGRESO' | 'CERRADO';
  responsable_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  presupuesto: number;
  created_at: string;
  updated_at: string;
}

export interface Tarea {
  id: string;
  proyecto_id: string;
  titulo: string;
  descripcion: string;
  estado: 'TODO' | 'IN_PROGRESS' | 'DONE';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  asignado_a: string;
  fecha_vencimiento: string;
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  estado: 'ACTIVO' | 'INACTIVO';
  created_at: string;
  updated_at: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  categoria: string;
  estado: 'ACTIVO' | 'INACTIVO';
  created_at: string;
  updated_at: string;
}

export interface Licencia {
  id: string;
  usuario_id: string;
  tipo: 'BASICA' | 'PROFESIONAL' | 'EMPRESARIAL';
  fecha_inicio: string;
  fecha_vencimiento: string;
  estado: 'ACTIVA' | 'EXPIRADA' | 'CANCELADA';
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  usuario_id: string;
  accion: string;
  tabla: string;
  registro_id: string;
  cambios: Record<string, any>;
  created_at: string;
}

/**
 * Inicializar Supabase
 */
export const initSupabase = async () => {
  try {
    // Verificar conexión
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error conectando a Supabase:', error);
      return false;
    }

    console.log('✅ Conectado a Supabase exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando Supabase:', error);
    return false;
  }
};

/**
 * Cerrar conexión
 */
export const closeSupabase = async () => {
  try {
    // Supabase maneja automáticamente, pero podemos limpiar si es necesario
    console.log('✅ Supabase cerrado');
  } catch (error) {
    console.error('❌ Error cerrando Supabase:', error);
  }
};

export default supabase;
