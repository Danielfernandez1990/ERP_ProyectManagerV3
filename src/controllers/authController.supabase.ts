/**
 * Auth Controller - SUPABASE VERSION
 */
import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, nombre, apellido } = req.body;
    if (!email || !password || !nombre || !apellido) {
      res.status(400).json({ error: 'Faltan campos requeridos' });
      return;
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (authError) { res.status(400).json({ error: authError.message }); return; }

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .insert([{ id: authData.user.id, email, nombre, apellido, rol: 'OPERARIO', estado: 'ACTIVO' }])
      .select();

    if (userError) { res.status(400).json({ error: userError.message }); return; }

    res.status(201).json({ message: 'Usuario registrado', user: userData[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error en registro', details: error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: 'Email y contraseña requeridos' }); return; }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { res.status(401).json({ error: 'Credenciales inválidas' }); return; }

    const { data: userData, error: userError } = await supabase
      .from('usuarios').select('*').eq('email', email).single();
    if (userError) { res.status(400).json({ error: 'Error obteniendo usuario' }); return; }

    await supabase.from('usuarios').update({ ultimo_acceso: new Date().toISOString() }).eq('id', authData.user.id);

    const token = generateToken({
      userId: authData.user.id as unknown as number,
      empresaId: 0,
      email: userData.email,
      rol: userData.rol,
    });

    res.json({ message: 'Login exitoso', token, user: userData, session: authData.session });
  } catch (error) {
    res.status(500).json({ error: 'Error en login', details: error });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) { res.status(400).json({ error: error.message }); return; }
    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    res.status(500).json({ error: 'Error en logout', details: error });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) { res.status(400).json({ error: 'Refresh token requerido' }); return; }

    const { data: authData, error } = await supabase.auth.refreshSession({ refresh_token });
    if (error) { res.status(401).json({ error: 'Token inválido o expirado' }); return; }

    res.json({ message: 'Token refrescado', session: authData.session });
  } catch (error) {
    res.status(500).json({ error: 'Error refrescando token', details: error });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) { res.status(401).json({ error: 'No autenticado' }); return; }

    const { data, error } = await supabase.from('usuarios').select('*').eq('id', userId).single();
    if (error) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo usuario', details: error });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) { res.status(400).json({ error: 'Email requerido' }); return; }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password`,
    });
    if (error) { res.status(400).json({ error: error.message }); return; }
    res.json({ message: 'Email de reset enviado' });
  } catch (error) {
    res.status(500).json({ error: 'Error en reset', details: error });
  }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { new_password } = req.body;
    const userId = (req as any).user?.id;
    if (!userId || !new_password) { res.status(400).json({ error: 'Datos requeridos' }); return; }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: new_password });
    if (error) { res.status(400).json({ error: error.message }); return; }
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando contraseña', details: error });
  }
};
