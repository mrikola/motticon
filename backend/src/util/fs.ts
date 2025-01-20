import { existsSync, mkdirSync } from "fs";

export const FILE_ROOT = "/photos";

export const createDirIfNotExists = (path: string) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};

export const removeScandinavianLetters = (fileName: string): string => {
  const replacements = {
    æ: "ae",
    ø: "o",
    å: "a",
    ä: "a",
    Æ: "AE",
    Ø: "O",
    Å: "A",
    Ä: "A",
  };

  return fileName.replace(/[æøåäÆØÅÄ]/g, (char) => replacements[char] || char);
};
