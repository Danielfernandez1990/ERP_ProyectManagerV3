import { validate, authSchemas, clienteSchemas, usuarioSchemas, ValidationError } from '../../utils/validators';

describe('Validators', () => {
  describe('Auth Schemas', () => {
    it('should validate correct register data', () => {
      const data = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        empresa_nombre: 'Test Company',
      };

      const result = validate(data, authSchemas.register);
      expect(result).toEqual(data);
    });

    it('should reject weak password', () => {
      const data = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'weak',
        empresa_nombre: 'Test Company',
      };

      expect(() => validate(data, authSchemas.register)).toThrow(ValidationError);
    });

    it('should reject invalid email', () => {
      const data = {
        nombre: 'Test User',
        email: 'invalid-email',
        password: 'TestPass123!',
        empresa_nombre: 'Test Company',
      };

      expect(() => validate(data, authSchemas.register)).toThrow(ValidationError);
    });

    it('should validate correct login data', () => {
      const data = {
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      const result = validate(data, authSchemas.login);
      expect(result).toEqual(data);
    });
  });

  describe('Cliente Schemas', () => {
    it('should validate correct cliente data', () => {
      const data = {
        nombre: 'Test Client',
        rut: '12.345.678-9',
        email: 'client@example.com',
        telefono: '1234567890',
      };

      const result = validate(data, clienteSchemas.create);
      expect(result).toBeDefined();
    });

    it('should reject invalid RUT format', () => {
      const data = {
        nombre: 'Test Client',
        rut: 'invalid-rut',
        email: 'client@example.com',
      };

      expect(() => validate(data, clienteSchemas.create)).toThrow(ValidationError);
    });

    it('should reject short nombre', () => {
      const data = {
        nombre: 'A',
        rut: '12.345.678-9',
        email: 'client@example.com',
      };

      expect(() => validate(data, clienteSchemas.create)).toThrow(ValidationError);
    });
  });

  describe('Usuario Schemas', () => {
    it('should validate correct usuario creation', () => {
      const data = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        rol: 'OPERARIO',
      };

      const result = validate(data, usuarioSchemas.create);
      expect(result).toBeDefined();
    });

    it('should reject invalid rol', () => {
      const data = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        rol: 'INVALID_ROLE',
      };

      expect(() => validate(data, usuarioSchemas.create)).toThrow(ValidationError);
    });
  });
});
