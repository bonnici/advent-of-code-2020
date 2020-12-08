import * as fs from 'fs';

export const readLines = (path: string) =>
  fs.readFileSync(path, 'utf8').split('\n').map((line: string) => line.trim());

export const readLinesInGroups = (path: string) => {
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
