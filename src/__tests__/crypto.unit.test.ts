import { hashPassword, comparePassword, generateHash } from '../../utils/crypto';

describe('Crypto Utils', () => {
  describe('Password Hashing', () => {
    it('should hash password successfully', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should compare password correctly', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should not match incorrect password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      const isMatch = await comparePassword('WrongPassword123!', hash);
      expect(isMatch).toBe(false);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Hash Generation', () => {
    it('should generate random hash', () => {
      const hash = generateHash();

      expect(hash).toBeDefined();
      expect(hash.length).toBe(64); // 32 bytes * 2 (hex)
      expect(/^[a-f0-9]+$/.test(hash)).toBe(true);
    });

    it('should generate unique hashes', () => {
      const hash1 = generateHash();
      const hash2 = generateHash();

      expect(hash1).not.toBe(hash2);
    });
  });
});
