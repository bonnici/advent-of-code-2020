import { readLinesWithTransform } from '../lib';

interface Instruction {
  action: string;
  value: number;
}

enum Direction {
  EAST = 0,
  SOUTH = 1,
  WEST = 2,
  NORTH = 3,
}

const input: Instruction[] = readLinesWithTransform('src/day12/input.txt', (line) => ({
  action: line.substr(0, 1),
  value: parseInt(line.substr(1), 10),
})).filter(inst => !!inst.action);
// console.log('input', input);

// Part 1
let xDiff = 0;
let yDiff = 0;
let dir: Direction = Direction.EAST;

// Part 2
let xWaypoint = 10;
let yWaypoint = 1;
let xDiffPart2 = 0;
let yDiffPart2 = 0;

const turn = (inst: Instruction) => {
  if ((inst.action !== 'L' && inst.action !== 'R') || (inst.value !== 90 && inst.value !== 180 && inst.value !== 270)) {
    throw new Error(`Invalid turn ${inst.action} ${inst.value}`);
  }
  dir += (Math.floor(inst.value / 90) * (inst.action === 'L' ? -1 : 1));
  if (dir < 0) {
    dir += 4;
  } else if (dir > 3) {
    dir -= 4;
  }
};

const rotateWaypoint = (inst: Instruction) => {
  if ((inst.action !== 'L' && inst.action !== 'R') || (inst.value !== 90 && inst.value !== 180 && inst.value !== 270)) {
    throw new Error(`Invalid rotation ${inst.action} ${inst.value}`);
  }

  let times = Math.floor(inst.value / 90);

  while (times > 0) {
    switch (inst.action) {
      case 'L': {
        const temp = xWaypoint;
        xWaypoint = -1 * yWaypoint;
        yWaypoint = temp;
        break;
      }
      case 'R': {
        const temp = yWaypoint;
        yWaypoint = -1 * xWaypoint;
        xWaypoint = temp;
        break;
      }
    }
    times--;
  }
};

for (const inst of input) {
  switch (inst.action) {
    case 'N': {
      yDiff += inst.value;
      yWaypoint += inst.value;
      break;
    }
    case 'S': {
      yDiff -= inst.value;
      yWaypoint -= inst.value;
      break;
    }
    case 'E': {
      xDiff += inst.value;
      xWaypoint += inst.value;
      break;
    }
    case 'W': {
      xDiff -= inst.value;
      xWaypoint -= inst.value;
      break;
    }
    case 'L':
    case 'R': {
      turn(inst);
      rotateWaypoint(inst);
      break;
    }
    case 'F': {
      switch (dir) {
        // @ts-ignore
        case Direction.NORTH: {
          yDiff += inst.value;
          break;
        }
        // @ts-ignore
        case Direction.SOUTH: {
          yDiff -= inst.value;
          break;
        }
        case Direction.EAST: {
          xDiff += inst.value;
          break;
        }
        // @ts-ignore
        case Direction.WEST: {
          xDiff -= inst.value;
          break;
        }
        default:
          throw new Error(`Invalid direction ${dir}`);
      }

      xDiffPart2 += (xWaypoint * inst.value);
      yDiffPart2 += (yWaypoint * inst.value);

      break;
    }
    default:
      throw new Error(`Invalid instruction ${inst.action} ${inst.value}`);
  }
}

console.log('results', { xDiff, yDiff, xDiffPart2, yDiffPart2, xWaypoint, yWaypoint });
console.log(`Part 1: ${Math.abs(xDiff) + Math.abs(yDiff)}`);
console.log(`Part 2: ${Math.abs(xDiffPart2) + Math.abs(yDiffPart2)}`);
// 52219 is too high
