import * as fs from 'fs';

export const readLines = (path: string) =>
  fs.readFileSync(path, 'utf8').split('\n').map((line: string) => line.trim());