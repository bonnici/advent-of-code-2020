import { readLines } from '../lib';

const input = readLines('src/day24/input.txt');
// console.log('input', input);

/*
let minRowDiff = 0;
let maxRowDiff = 0;

for (const line of input) {
  const rowDiff = (line.match(/s/g) || []).length - (line.match(/n/g) || []).length;
  // console.log('Row diff: ', rowDiff);

  minRowDiff = Math.min(minRowDiff, rowDiff);
  maxRowDiff = Math.max(maxRowDiff, rowDiff);
}

console.log(`Min row diff: ${minRowDiff}, max row diff: ${maxRowDiff}`);
*/

enum Dir {
  E,
  SE,
  SW,
  W,
  NW,
  NE
}

const extractDirs = (line: string): Dir[] => {
  const result: Dir[] = [];

  let charIdx = 0;
  do {
    const ch = line.charAt(charIdx++);
    if (ch === 'e') {
      result.push(Dir.E);
    } else if (ch === 'w') {
      result.push(Dir.W);
    } else if (ch === 's') {
      const nextCh = line.charAt(charIdx++);
      if (nextCh === 'e') {
        result.push(Dir.SE);
      } else if (nextCh === 'w') {
        result.push(Dir.SW);
      } else {
        throw new Error('Unexpected direction')
      }
    } else if (ch === 'n') {
      const nextCh = line.charAt(charIdx++);
      if (nextCh === 'e') {
        result.push(Dir.NE);
      } else if (nextCh === 'w') {
        result.push(Dir.NW);
      } else {
        throw new Error('Unexpected direction')
      }
    } else {
      throw new Error('Unexpected direction')
    }
  } while (charIdx < line.length)

  return result;
}

const flipped = new Set<string>();
for (const line of input) {
  const dirs = extractDirs(line);
  let row = 0;
  let col = 0;
  let onOddRow = false;

  for (const dir of dirs) {
    switch (dir) {
      case Dir.E:
        col += 1;
        break;
      case Dir.SE:
        row += 1;
        if (onOddRow) {
          col += 1;
        }
        onOddRow = !onOddRow;
        break;
      case Dir.SW:
        row += 1;
        if (!onOddRow) {
          col -= 1;
        }
        onOddRow = !onOddRow;
        break;
      case Dir.W:
        col -= 1;
        break;
      case Dir.NW:
        row -= 1;
        if (!onOddRow) {
          col -= 1;
        }
        onOddRow = !onOddRow;
        break;
      case Dir.NE:
        row -= 1;
        if (onOddRow) {
          col += 1;
        }
        onOddRow = !onOddRow;
        break;
    }
  }

  const hex = `${row},${col}`;
  // console.log(`flipping hex ${hex}`);

  if (flipped.has(hex)) {
    flipped.delete(hex);
  } else {
    flipped.add(hex);
  }
}

console.log(`Part 1: ${flipped.size}`)
