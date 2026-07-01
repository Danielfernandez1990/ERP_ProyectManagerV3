import Joi from 'joi';

/**
 * Validation schemas for user input
 */

export const authSchemas = {
  register: Joi.object({
    nombre: Joi.string().min(2).max(255).required().messages({
      'string.empty': 'Nombre es requerido',
      'string.min': 'Nombre debe tener al menos 2 caracteres',
      'string.max': 'Nombre no puede exceder 255 caracteres',
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required().messages({
      'string.empty': 'Email es requerido',
      'string.email': 'Email debe ser válido',
    }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
      .required()
      .messages({
        'string.empty': 'Contraseña es requerida',
        'string.min': 'Contraseña debe tener al menos 8 caracteres',
        'string.pattern.base': 'Contraseña debe contener mayúscula, número y carácter especial',
      }),
    empresa_nombre: Joi.string().min(2).max(255).required(),
  }),

  login: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required().messages({
      'string.empty': 'Email es requerido',
      'string.email': 'Email debe ser válido',
    }),
    password: Joi.string().min(1).required().messages({
      'string.empty': 'Contraseña es requerida',
    }),
  }),

  refresh: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  updatePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
      .required(),
  }),
};

export const usuarioSchemas = {
  create: Joi.object({
    nombre: Joi.string().min(2).max(255).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required(),
    rol: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'OPERARIO', 'VISUALIZADOR').required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
      .required(),
    supervisor_id: Joi.number().integer().optional(),
  }),

  update: Joi.object({
    nombre: Joi.string().min(2).max(255).optional(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).optional(),
    rol: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'OPERARIO', 'VISUALIZADOR').optional(),
    supervisor_id: Joi.number().integer().optional(),
  }),
};

export const clienteSchemas = {
  create: Joi.object({
    nombre: Joi.string().min(2).max(255).required(),
    rut: Joi.string().pattern(/^\d{1,2}\.\d{3}\.\d{3}-[0-9K]$/).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).optional(),
    telefono: Joi.string().optional(),
  }),

  update: Joi.object({
    nombre: Joi.string().min(2).max(255).optional(),
    rut: Joi.string().pattern(/^\d{1,2}\.\d{3}\.\d{3}-[0-9K]$/).optional(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).optional(),
    telefono: Joi.string().optional(),
  }),
};

export const productoSchemas = {
  create: Joi.object({
    nombre: Joi.string().min(2).max(255).required(),
    sku: Joi.string().min(2).max(50).required(),
    stock: Joi.number().integer().min(0).required(),
    precio: Joi.number().positive().required(),
    descripcion: Joi.string().optional(),
  }),

  update: Joi.object({
    nombre: Joi.string().min(2).max(255).optional(),
    sku: Joi.string().min(2).max(50).optional(),
    stock: Joi.number().integer().min(0).optional(),
    precio: Joi.number().positive().optional(),
    descripcion: Joi.string().optional(),
  }),
};

export const licenciaSchemas = {
  create: Joi.object({
    plan: Joi.string().valid('BASICO', 'PRO', 'ENTERPRISE').required(),
    usuarios_max: Joi.number().integer().positive().required(),
    fecha_inicio: Joi.date().iso().required(),
    fecha_expiracion: Joi.date().iso().required(),
  }),

  update: Joi.object({
    plan: Joi.string().valid('BASICO', 'PRO', 'ENTERPRISE').optional(),
    usuarios_max: Joi.number().integer().positive().optional(),
    fecha_expiracion: Joi.date().iso().optional(),
    estado: Joi.string().valid('activo', 'inactivo', 'expirado').optional(),
  }),
};

/**
 * Validate input against schema
 */
export const validate = (data: any, schema: Joi.ObjectSchema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    throw new ValidationError(errors);
  }

  return value;
};

export class ValidationError extends Error {
  constructor(public errors: any[]) {
    super('Validation error');
    this.name = 'ValidationError';
  }
}
