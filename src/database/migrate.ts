import { getDatabase, closeDatabase } from './config/database';
import logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

/**
 * Run database migrations
 */
export const migrate = async () => {
  const db = await getDatabase();

  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));

    for (const file of files.sort()) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

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
