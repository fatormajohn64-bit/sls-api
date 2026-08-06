import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/sls_dev',
    pool: { min: 0, max: 5 },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
    },
  },
};

export default config;
