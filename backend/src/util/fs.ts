import { existsSync, mkdirSync } from "fs";

export const FILE_ROOT = "/photos";

export const createDirIfNotExists = (path: string) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};
