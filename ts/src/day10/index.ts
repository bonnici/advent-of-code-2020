import { readLinesAsInts } from '../lib';

const input = readLinesAsInts('src/day10/sample2.txt');
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

const branchesByIndex = [];
let branchCounts = [0, 0, 0];
for (let i = 0; i < sorted.length; i++) {
  const curNum = sorted[i];
  if (i + 3 < sorted.length && sorted[i + 3] === curNum + 3) {
    branchesByIndex.push(3);
    branchCounts[2]++;
  } else if (i + 2 < sorted.length && sorted[i + 2] === curNum + 2) {
    branchesByIndex.push(2);
    branchCounts[1]++;
  } else {
    branchesByIndex.push(1);
    branchCounts[0]++;
  }
}

console.log(`branchesByIndex`, branchesByIndex);
console.log(`branchCounts`, branchCounts);

let skippedDifferences = 0;
for (let i = 0; i < branchesByIndex.length; i++) {
  if (branchesByIndex[i] === 2 && i + 1 < branchesByIndex.length) {
    skippedDifferences += branchesByIndex[i + 1];
  } else if (branchesByIndex[i] === 3) {
    if (i + 1 < branchesByIndex.length) {
      skippedDifferences += branchesByIndex[i + 1];
    }
    if (i + 2 < branchesByIndex.length) {
      skippedDifferences += branchesByIndex[i + 2];
    }
  }
}

console.log(`skippedDifferences: ${skippedDifferences}`);
console.log(`Part 2: ${Math.pow(2, branchCounts[1]) * Math.pow(3, branchCounts[2]) - skippedDifferences}`);
