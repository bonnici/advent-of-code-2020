import { readLines } from '../lib';

const input = readLines('src/day3/input.txt');

const countTrees = (downCount: number, rightCount: number) => {
  let curRow = 0;
  let curCol = 0;
  let treeCount = 0;

  while (curRow < input.length) {
    const row = input[curRow];

    if (row[curCol] === '#') {
      treeCount++;
    }

    curCol += rightCount;
    if (curCol >= row.length) {
      curCol -= row.length;
    }

    curRow += downCount;
  }

  return treeCount;
}

console.log(`Part 1: ${countTrees(1, 3)}`);

const right1Down1 = countTrees(1, 1);
const right3Down1 = countTrees(1, 3);
const right5Down1 = countTrees(1, 5);
const right7Down1 = countTrees(1, 7);
const right1Down2 = countTrees(2, 1);

console.log(`Part 2: ${right1Down1 * right3Down1 * right5Down1 * right7Down1 * right1Down2}`);