import { readLinesAsInts } from '../lib';

const input = readLinesAsInts('src/day10/input.txt');
// console.log('input', input);

const sorted = [...input].sort((a, b) => a - b);

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

sorted.unshift(0);
sorted.push(sorted[sorted.length - 1] + 3);
// console.log('sorted', sorted);

const diffsByIndex = [];
for (let i = 0; i < sorted.length - 1; i++) {
  diffsByIndex.push(sorted[i + 1] - sorted[i]);
}

let subgroups = [];
let curSubgroup: number[] = [];

for (const branch of diffsByIndex) {
  if (branch === 3) {
    subgroups.push(curSubgroup);
    curSubgroup = [];
  } else {
    curSubgroup.push(branch);
  }
}

subgroups.push(curSubgroup);
subgroups = subgroups.filter(s => s.length > 0);

// console.log(`diffsByIndex`, diffsByIndex);
// console.log(`subgroups`, subgroups);

// all differences are 1s or 3s, can use the tribonnaci method
// also know that the max length of 1s is 4

const tribonnaci = (length: number): number => {
  switch (length) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 4;
    case 4:
      return 7;
    default:
      throw new Error('unexpected tribonnaci');
  }
}

let result = 1;
for (const subgroup of subgroups) {
  result *= tribonnaci(subgroup.length);
}

console.log(`Part 2 ${result}`);
