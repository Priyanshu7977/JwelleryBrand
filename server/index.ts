import { app } from './app';
import { config } from './config/index';
import { logger } from './utils/logger';
import { testConnection } from './db/pool';

async function startServer() {
  // Test DB connection
  await testConnection();

  app.listen(config.port, () => {
    logger.info(`✨ Celestia Luxury Atelier Backend listening on port ${config.port}`);
    logger.info(`📍 Mode: ${config.env} | Timezone: ${config.timezone}`);
    logger.info(`🔗 API Endpoint: http://localhost:${config.port}/api`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    logger.error('Fatal backend startup failure:', err);
    process.exit(1);
  });
}
