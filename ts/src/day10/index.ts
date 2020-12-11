import { readLinesAsInts } from '../lib';

const input = readLinesAsInts('src/day10/input.txt');
// console.log('input', input);

const sorted = [...input].sort((a, b) => a - b);
// console.log('sorted', sorted);

const differences = [0, 0, 1];
let lastNum = 0;

for (const curNum of sorted) {
  const diff = curNum - lastNum;

  if (diff < 1 || diff > 3) {
    throw new Error(`Invalid difference ${diff} at num ${curNum}`);
  }

  // console.log(`diff between ${curNum} and ${lastNum} is ${diff}`);
  differences[diff - 1]++;

  lastNum = curNum;
}

console.log(`differences: ${differences[0]}, ${differences[1]}, ${differences[2]}`);
console.log(`Part 1: ${differences[0] * differences[2]}`);
