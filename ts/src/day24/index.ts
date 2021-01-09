import { readLines } from '../lib';

const input = readLines('src/day24/input.txt');
// console.log('input', input);

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

class Hex {
  public row: number;
  public col: number;

  constructor(hexStr: string) {
    const split = hexStr.split(',');
    this.row = parseInt(split[0], 10);
    this.col = parseInt(split[1], 10);
  }

  toString() {
    return `${this.row},${this.col}`
  }

  move(dir: Dir) {
    const onOddRow = this.row % 2 !== 0;
    switch (dir) {
      case Dir.E:
        this.col += 1;
        break;
      case Dir.SE:
        this.row += 1;
        if (!onOddRow) {
          this.col += 1;
        }
        break;
      case Dir.SW:
        this.row += 1;
        if (onOddRow) {
          this.col -= 1;
        }
        break;
      case Dir.W:
        this.col -= 1;
        break;
      case Dir.NW:
        this.row -= 1;
        if (onOddRow) {
          this.col -= 1;
        }
        break;
      case Dir.NE:
        this.row -= 1;
        if (!onOddRow) {
          this.col += 1;
        }
        break;
      default:
        throw new Error('Invalid direction');
    }
  }
}

let flipped = new Set<string>();
for (const line of input) {
  const dirs = extractDirs(line);
  const hex = new Hex('0,0');

  for (const dir of dirs) {
    hex.move(dir);
  }

  const hexStr = hex.toString();
  // console.log(`flipping hex ${hexStr}`);

  if (flipped.has(hexStr)) {
    flipped.delete(hexStr);
  } else {
    flipped.add(hexStr);
  }
}

console.log(`Part 1: ${flipped.size}`);

const blackNeighbour = (hexStr: string, dir: Dir, curFlipped: Set<string>): boolean => {
  const hex = new Hex(hexStr);
  if (dir !== undefined) {
    hex.move(dir);
  }
  return curFlipped.has(hex.toString());
}

const evaluate = (hexStr: string, curFlipped: Set<string>, newFlipped: Set<string>, evaluated: Set<string>, dir: Dir | undefined) => {
  const hex = new Hex(hexStr);
  if (dir !== undefined) {
    hex.move(dir);
  }

  if (evaluated.has(hex.toString())) {
    return;
  }

  let surroundingCount = 0;
  if (blackNeighbour(hex.toString(), Dir.E, curFlipped)) { surroundingCount++; }
  if (blackNeighbour(hex.toString(), Dir.SE, curFlipped)) { surroundingCount++; }
  if (blackNeighbour(hex.toString(), Dir.SW, curFlipped)) { surroundingCount++; }
  if (blackNeighbour(hex.toString(), Dir.W, curFlipped)) { surroundingCount++; }
  if (blackNeighbour(hex.toString(), Dir.NW, curFlipped)) { surroundingCount++; }
  if (blackNeighbour(hex.toString(), Dir.NE, curFlipped)) { surroundingCount++; }

  if (curFlipped.has(hex.toString())) {
    if (surroundingCount === 0 || surroundingCount > 2 ) {
      newFlipped.delete(hex.toString());
    }
  } else {
    if (surroundingCount === 2) {
      newFlipped.add(hex.toString());
    }
  }

  evaluated.add(hex.toString());
}

for (let day = 1; day <= 100; day++) {
  const newFlipped = new Set(flipped);
  const evaluated = new Set<string>();

  for (const hex of flipped.values()) {
    evaluate(hex, flipped, newFlipped, evaluated, undefined);
    evaluate(hex, flipped, newFlipped, evaluated, Dir.E);
    evaluate(hex, flipped, newFlipped, evaluated, Dir.SE);
    evaluate(hex, flipped, newFlipped, evaluated, Dir.SW);
    evaluate(hex, flipped, newFlipped, evaluated, Dir.W);
    evaluate(hex, flipped, newFlipped, evaluated, Dir.NW);
    evaluate(hex, flipped, newFlipped, evaluated, Dir.NE);
  }

  flipped = newFlipped;
  console.log(`Day ${day}: ${flipped.size}`);
}

console.log(`Part 2: ${flipped.size}`);