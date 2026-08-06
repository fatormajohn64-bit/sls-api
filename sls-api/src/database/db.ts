import knex, { Knex } from 'knex';
import config from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
export const db: Knex = knex(config[environment]);

/**
 * Validates the PostgreSQL database connection pool.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.raw('SELECT 1');
    return true;
  } catch (error) {
    console.error('[Database Error] Connection check failed:', error);
    return false;
  }
}
