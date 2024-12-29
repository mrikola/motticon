import { DataSource } from 'typeorm';
import { loadConfig } from './config/config';
import { readFileSync } from 'fs';
import path from 'path';

const config = loadConfig();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.databaseUrl,
  logging: process.env.NODE_ENV !== 'production',
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  migrationsRun: true,
});

export const setupDatabase = async (dataSource: DataSource = AppDataSource): Promise<void> => {
  try {
    console.log('Setting up database...');
    const sqlPath = path.join(__dirname, '..', 'db', 'markku.sql');
    
    const sqlContent = readFileSync(sqlPath, 'utf8');
    await dataSource.query(sqlContent);
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
};
