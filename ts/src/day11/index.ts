import { readLinesAsChars } from '../lib';

const input = readLinesAsChars('src/day11/input.txt');
// console.log('input', input);

enum IsOccupiedResult {
  OUT_OF_BOUNDS,
  UNOCCUPIED,
  OCCUPIED,
  FLOOR,
}

const isOccupiedRowCol = (state: string[][], rowNum: number, colNum: number): IsOccupiedResult => {
  if (rowNum < 0 || rowNum >= state.length) {
    return IsOccupiedResult.OUT_OF_BOUNDS;
  }

  const row = state[rowNum];

  if (colNum < 0 || colNum >= row.length) {
    return IsOccupiedResult.OUT_OF_BOUNDS;
  }

  switch (row[colNum]) {
    case 'L':
      return IsOccupiedResult.UNOCCUPIED;
    case '#':
      return IsOccupiedResult.OCCUPIED;
    case '.':
      return IsOccupiedResult.FLOOR;
    default:
      throw new Error('Unexpected input');
  }
}

const isOccupied = (state: string[][], rowStart: number, rowDelta: number, colStart: number, colDelta: number, part2: boolean) => {
  if (!part2) {
    const rowNum = rowStart + rowDelta;
    const colNum = colStart + colDelta;
    return isOccupiedRowCol(state, rowNum, colNum) === IsOccupiedResult.OCCUPIED;
  } else {
    let curRowNum = rowStart;
    let curColNum = colStart;
    let result;
    do {
      curRowNum += rowDelta;
      curColNum += colDelta;
      result = isOccupiedRowCol(state, curRowNum, curColNum);
    } while (result === IsOccupiedResult.FLOOR)

    return result === IsOccupiedResult.OCCUPIED;
  }
}

const occupiedCount = (state: string[][], i: number, j: number, part2: boolean): number => {
  let count = 0;

  if (isOccupied(state, i, -1, j, -1, part2)) {
    count++;
  }
  if (isOccupied(state, i, -1, j, 0, part2)) {
    count++;
  }
  if (isOccupied(state, i, -1, j, 1, part2)) {
    count++;
  }
  if (isOccupied(state, i, 0, j, -1, part2)) {
    count++;
  }
  if (isOccupied(state, i, 0, j, 1, part2)) {
    count++;
  }
  if (isOccupied(state, i, 1, j, -1, part2)) {
    count++;
  }
  if (isOccupied(state, i, 1, j, 0, part2)) {
    count++;
  }
  if (isOccupied(state, i, 1, j, 1, part2)) {
    count++;
  }


  return count;
}

const stepDay = (curState: string[][], part2: boolean): { newState: string[][], changedChars: number } => {
  const next = JSON.parse(JSON.stringify(curState));
  let changed = 0;

  for (let i = 0; i < curState.length; i++) {
    const row = curState[i];
    for (let j = 0; j < row.length; j++) {
      const curSpot = row[j];
      if (curSpot === 'L') {
        if (occupiedCount(curState, i, j, part2) === 0) {
          next[i][j] = '#';
          changed++;
        }
      } else if (curSpot === '#') {
        if (part2 ? occupiedCount(curState, i, j, true) >= 5 : occupiedCount(curState, i, j, false) >= 4) {
          next[i][j] = 'L';
          changed++;
        }
      }
    }
  }

  return { newState: next, changedChars: changed };
}

const countOccupied = (state: string[][]): number => {
  const joined = nextState.map(row => row.join()).join();
  // console.log('joined', joined);
  return joined.split('').filter(ch => ch === '#').length;
}

let changedChars = 0;
let nextState = input;
// console.log('start state', input);
do {
  const result = stepDay(nextState, false);
  changedChars = result.changedChars;
  nextState = result.newState;
  // console.log('newState', nextState);
} while (changedChars > 0)

console.log(`Part 1 ${countOccupied(nextState)}`);

changedChars = 0;
nextState = input;
// console.log(input);
do {
  const result = stepDay(nextState, true);
  changedChars = result.changedChars;
  nextState = result.newState;
  // console.log(nextState);
} while (changedChars > 0)

console.log(`Part 2 ${countOccupied(nextState)}`);
