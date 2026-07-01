/**
 * Auth Controller - SUPABASE VERSION
 * Maneja autenticación usando Supabase Auth
 */

import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import { generateToken, verifyToken } from '../utils/jwt';

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, nombre, apellido } = req.body;

    if (!email || !password || !nombre || !apellido) {
      res.status(400).json({ error: 'Faltan campos requeridos' });
      return;
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (authError) {
      res.status(400).json({ error: authError.message });
      return;
    }

    const userId = authData.user.id;

    // Guardar datos adicionales en tabla usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .insert([
        {
          id: userId,
          email,
          nombre,
          apellido,
          rol: 'OPERARIO',
          estado: 'ACTIVO',
        },
      ])
      .select();

    if (userError) {
      res.status(400).json({ error: 'Error creando usuario: ' + userError.message });
      return;
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userData[0],
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en registro', details: error });
  }
};

/**
 * POST /api/auth/login
 * Login de usuario
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña requeridos' });
      return;
    }

    // Autenticar con Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) {
      res.status(400).json({ error: 'Error obteniendo datos de usuario' });
      return;
    }

    // Actualizar último acceso
    await supabase
      .from('usuarios')
      .update({ ultimo_acceso: new Date().toISOString() })
      .eq('id', authData.user.id);

    // Generar JWT personalizado (opcional - para compatibilidad)
    const token = generateToken(authData.user.id, userData.rol);

    res.json({
      message: 'Login exitoso',
      token,
      user: userData,
      session: authData.session,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en login', details: error });
  }
};

/**
 * POST /api/auth/logout
 * Logout de usuario
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    res.status(500).json({ error: 'Error en logout', details: error });
  }
};

/**
 * POST /api/auth/refresh
 * Refrescar token JWT
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({ error: 'Refresh token requerido' });
      return;
    }

    // Refrescar sesión en Supabase
    const { data: authData, error: authError } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (authError) {
      res.status(401).json({ error: 'Token inválido o expirado' });
      return;
    }

    res.json({
      message: 'Token refrescado',
      session: authData.session,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error refrescando token', details: error });
  }
};

/**
 * GET /api/auth/me
 * Obtener datos del usuario actual
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { data: userData, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo usuario', details: error });
  }
};

/**
 * POST /api/auth/password-reset
 * Solicitar reset de contraseña
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email requerido' });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password`,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({ message: 'Email de reset enviado' });
  } catch (error) {
    res.status(500).json({ error: 'Error en reset', details: error });
  }
};

/**
 * POST /api/auth/update-password
 * Actualizar contraseña
 */
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { new_password } = req.body;
    const userId = (req as any).user?.id;

    if (!userId || !new_password) {
      res.status(400).json({ error: 'Usuario y nueva contraseña requeridos' });
      return;
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: new_password,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando contraseña', details: error });
  }
};
