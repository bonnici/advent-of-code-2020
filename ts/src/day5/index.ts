import { readLines } from '../lib';

const input = readLines('src/day5/input.txt');

const fromBinaryInput = (val: string) => {
  let result = 0;
  let curVal = 1;
  for (let i = val.length - 1; i >= 0; i--) {
    const ch = val[i];
    if (ch === 'B' || ch === 'R') {
      result += curVal;
    }

    // tslint:disable-next-line:no-bitwise
    curVal <<= 1;
  }

  return result;
}

let maxSeatId = 0;
const seatIds = [];
for (const line of input) {
  // console.log(line);

  const row = fromBinaryInput(line.substr(0, 7));
  const col = fromBinaryInput(line.substr(7));
  const seatId = (row * 8) + col;
  seatIds.push(seatId);

  // console.log(`row: ${row}, col: ${col}, id: ${seatId}`);

  maxSeatId = Math.max(maxSeatId, seatId);
}

console.log(`Part 1: ${maxSeatId}`);

seatIds.sort((a, b) => a - b);
console.log(`seatIds:`, seatIds);

let lastSeatId = 0;
for (const seatId of seatIds) {
  if (lastSeatId && seatId !== lastSeatId + 1) {
    console.log(`Part 2: ${seatId - 1}`);
    break;
  }
  lastSeatId = seatId;
}
