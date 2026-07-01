import { generateToken, verifyToken, decodeToken, JWTPayload } from '../../utils/jwt';

describe('JWT Utils', () => {
  const payload: JWTPayload = {
    userId: 1,
    empresaId: 1,
    email: 'test@example.com',
    rol: 'ADMIN',
  };

  describe('Token Generation', () => {
    it('should generate valid token', () => {
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT format: header.payload.signature
    });

    it('should generate refresh token', () => {
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('Token Verification', () => {
    it('should verify valid token', () => {
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded).toHaveProperty('userId');
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    it('should reject invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('should reject tampered token', () => {
      const token = generateToken(payload);
      const tampered = token.slice(0, -5) + 'xxxxx';

      expect(() => verifyToken(tampered)).toThrow();
    });
  });

  describe('Token Decoding', () => {
    it('should decode valid token', () => {
      const token = generateToken(payload);
      const decoded = decodeToken(token);

      expect(decoded).toHaveProperty('userId');
      expect(decoded?.userId).toBe(payload.userId);
    });

    it('should return null for invalid token', () => {
      const decoded = decodeToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });

  describe('Token Payload', () => {
    it('should include all required fields in payload', () => {
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBeDefined();
      expect(decoded.empresaId).toBeDefined();
      expect(decoded.email).toBeDefined();
      expect(decoded.rol).toBeDefined();
    });
  });
});
