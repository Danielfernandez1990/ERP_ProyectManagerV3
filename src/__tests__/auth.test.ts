import request from 'supertest';
import app from '../main';

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123!',
        empresa_nombre: 'Test Company',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.tokens.access).toBeDefined();
    });

    it('should fail with invalid password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nombre: 'Test User',
        email: 'test2@example.com',
        password: 'weak',
        empresa_nombre: 'Test Company',
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user', async () => {
      // First register
      await request(app).post('/api/auth/register').send({
        nombre: 'Login Test',
        email: 'login@example.com',
        password: 'LoginTest123!',
        empresa_nombre: 'Test Company 2',
      });

      // Then login
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'LoginTest123!',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.tokens.access).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'Wrong123!',
      });

      expect(res.statusCode).toBe(401);
    });
  });
});
