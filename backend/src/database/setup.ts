import { readFileSync } from 'fs';
import path from 'path';
import { AppDataSource } from '../data-source';

export async function setupDatabase(): Promise<void> {
  try {
    const sqlPath = path.join(__dirname, '..', '..', 'db', 'markku.sql');
    const sqlContent = readFileSync(sqlPath, 'utf8');
    
    await AppDataSource.query(sqlContent);
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
} 