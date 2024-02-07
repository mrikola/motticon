import { existsSync, mkdirSync } from "fs";

export const createDirIfNotExists = (path: string) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};
