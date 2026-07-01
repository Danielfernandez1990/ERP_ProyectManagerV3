import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';
import { hashPassword } from '../../utils/crypto';

// Mock usuario para tests
const mockUser = {
  id: 1,
  nombre: 'Test User',
  email: 'test@example.com',
  password: 'TestPass123!',
  empresa_nombre: 'Test Company',
};

describe('Auth Controller', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: mockUser.nombre,
          email: mockUser.email,
          password: mockUser.password,
          empresa_nombre: mockUser.empresa_nombre,
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(mockUser.email);
      expect(response.body.data.tokens).toHaveProperty('access');
      expect(response.body.data.tokens).toHaveProperty('refresh');
    });

    it('should fail with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test',
          email: 'test2@example.com',
          password: 'weak',
          empresa_nombre: 'Test Company',
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test',
          email: 'invalid-email',
          password: 'TestPass123!',
          empresa_nombre: 'Test Company',
        });

      expect(response.status).toBe(400);
    });

    it('should fail with duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test',
          email: 'duplicate@example.com',
          password: 'TestPass123!',
          empresa_nombre: 'Company 1',
        });

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test 2',
          email: 'duplicate@example.com',
          password: 'TestPass123!',
          empresa_nombre: 'Company 2',
        });

      expect(response.status).toBe(409);
      expect(response.body.code).toBe('EMAIL_ALREADY_EXISTS');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register user before login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          nombre: mockUser.nombre,
          email: 'login-test@example.com',
          password: mockUser.password,
          empresa_nombre: 'Test Company',
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login-test@example.com',
          password: mockUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.tokens).toHaveProperty('access');
      expect(response.body.data.tokens).toHaveProperty('refresh');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: mockUser.password,
        });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // Register and login
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: mockUser.nombre,
          email: 'refresh-test@example.com',
          password: mockUser.password,
          empresa_nombre: 'Test Company',
        });

      const refreshToken = registerRes.body.data.tokens.refresh;

      // Refresh token
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Token refreshed');
      expect(response.body.data).toHaveProperty('access');
    });

    it('should fail with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      // Register and get token
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: mockUser.nombre,
          email: 'me-test@example.com',
          password: mockUser.password,
          empresa_nombre: 'Test Company',
        });

      const token = registerRes.body.data.tokens.access;

      // Get current user
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe('me-test@example.com');
    });

    it('should fail without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('UNAUTHORIZED');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
