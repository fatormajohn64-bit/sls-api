import app from './app';
import { checkDatabaseConnection } from './database/db';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.API_PORT || 4000;

const startServer = async () => {
  console.log('Booting Sierra Leone Server API...');

  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) {
    console.error('CRITICAL: Database unreachable. Exiting.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`✅ SLS API listening on http://localhost:${PORT}`);
  });
};

startServer();
