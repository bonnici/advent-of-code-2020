import * as fs from 'fs';

export const readLines = (path: string): string[] =>
  fs.readFileSync(path, 'utf8').split('\n').map((line: string) => line.trim());

export const readLinesAsInts = (path: string): number[] =>
  readLines(path).map(line => parseInt(line, 10));

export const readLinesAsChars = (path: string): string[][] =>
  readLines(path).map(line => line.split(''));

export const readLinesWithTransform = (path: string, transform: (line: string) => any): any[] =>
  readLines(path).map(line => transform(line));

export const readLinesInGroups = (path: string): string[][] => {
  const lines = readLines(path);

  const groups: string[][] = [];
  let curGroup: string[] = [];
  lines.forEach((line) => {
    if (line === '') {
      groups.push(curGroup);
      curGroup = [];
    } else {
      curGroup.push(line);
    }
  });
  groups.push(curGroup);

  return groups;
}
