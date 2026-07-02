import { getDatabase, closeDatabase } from '../config/database';
import logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

export const migrate = async () => {
  const db = getDatabase();
  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      logger.warn('No migrations directory found, skipping.');
      return;
    }
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      logger.info(`Running migration: ${file}`);
      await db.query(sql);
      logger.info(`✅ Migration completed: ${file}`);
    }

    logger.info('✅ All migrations completed');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    await closeDatabase();
  }
};

if (require.main === module) {
  migrate();
}
