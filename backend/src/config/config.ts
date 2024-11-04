export interface Config {
  port: number;
  frontendUrl: string;
  databaseUrl: string;
  fileStorage: {
    root: string;
  };
}

const DEFAULT_DATABASE_URL = 'postgres://postgres:postgres@db:5432/motticon';

export const loadConfig = (): Config => {
  return {
    port: parseInt(process.env.PORT || '4000', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    databaseUrl: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    fileStorage: {
      root: process.env.FILE_ROOT || '/app/files',
    },
  };
}; 