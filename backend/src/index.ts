import { AppDataSource } from './data-source';
import { Server } from './server';
import { loadConfig } from './config/config';
import { setupDatabase } from './database/setup';

async function bootstrap() {
  try {
    const config = loadConfig();
    
    // Initialize database
    await AppDataSource.initialize();
    await setupDatabase();

    // Create and start server
    const server = new Server(config);
    await server.init();
    server.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
