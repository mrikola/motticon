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
    ö: "o",
    é: "e",
    Æ: "AE",
    Ø: "O",
    Å: "A",
    Ä: "A",
    Ö: "O",
    É: "E",
    " ": "_",
  };

  return fileName.replace(
    /[æøåäöÆØÅÄÖ\s]/g,
    (char) => replacements[char] || char
  );
};
