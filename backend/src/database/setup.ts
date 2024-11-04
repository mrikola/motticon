import { readFileSync } from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';

export async function setupDatabase(dataSource: DataSource): Promise<void> {
  try {
    const sqlPath = path.join(__dirname, '..', '..', 'db', 'markku.sql');
    const sqlContent = readFileSync(sqlPath, 'utf8');
    
    await dataSource.query(sqlContent);
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
} 