import { createApp } from './app.js';
import { config } from './config/env.js';
import { prisma } from './db/prisma.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log('====================================================');
  console.log(`🛒 FlexiPOS Commercial API Server Started`);
  console.log(`📡 URL: http://localhost:${config.port}/api/v1`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🛡️ Multi-Tenant Guard: ACTIVE`);
  console.log(`🔄 Offline-First Sync Endpoint: /api/v1/sync/orders`);
  console.log('====================================================');
});

// Graceful Shutdown
const handleShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Prisma database connection closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

