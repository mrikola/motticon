import { DataSource } from 'typeorm';
import { Config, loadConfig } from './config/config';

const config = loadConfig();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.databaseUrl,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
});

export const setupDatabase = async (dataSource: DataSource = AppDataSource): Promise<void> => {
  try {
    console.log('Setting up database...');
    // Add any initial setup queries here if needed
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
};
