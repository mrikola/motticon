export interface Config {
  port: number;
  frontendUrl: string;
  databaseUrl: string;
  fileStorage: {
    root: string;
  };
  r2: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl: string;
    rootDirectory?: string;
  };
}

const DEFAULT_DATABASE_URL =
  "postgres://postgres:postgres@localhost:5432/motticon";

export const loadConfig = (): Config => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;
  const rootDirectory = process.env.R2_ROOT_DIRECTORY;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    throw new Error(
      "Missing required R2 configuration. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME and R2_PUBLIC_URL environment variables."
    );
  }

  return {
    port: parseInt(process.env.PORT || "4000", 10),
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    databaseUrl: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    fileStorage: {
      root: process.env.FILE_ROOT || "/app/files",
    },
    r2: {
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
      publicUrl,
      rootDirectory,
    },
  };
};
