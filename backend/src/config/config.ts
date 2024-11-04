export interface Config {
  port: number;
  frontendUrl: string;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  fileStorage: {
    root: string;
  };
}

export const loadConfig = (): Config => {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'markku',
    },
    fileStorage: {
      root: process.env.FILE_ROOT || '/app/files',
    },
  };
}; 