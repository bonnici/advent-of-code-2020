import { readLines } from '../lib';

const input = readLines('src/day15/input.txt');
const numbers = input[0].split(',').map(n => parseInt(n, 10));
console.log('numbers', numbers);

const turns = [];
const numData = new Map<number, number>();
let lastAge = -1;

const incrementNumCount = (num: number, turn: number): number => {
  if (!numData.has(num)) {
    numData.set(num, turn);
    return 0;
  } else {
    const lastSpoken = numData.get(num) || 0;
    if (lastSpoken === 0) {
      throw new Error('Unexpected lastSpoken');
    }
    numData.set(num, turn);
    return turn - lastSpoken;
  }
}

for (const num of numbers) {
  turns.push(num);
  // console.log(`Turn ${turns.length}: ${num}`);
  lastAge = incrementNumCount(num, turns.length);
}

const targetNum = 30000000;
while (turns.length < targetNum - 1) {
  turns.push(lastAge);
  // console.log(`Turn ${turns.length}: ${lastAge}`);
  lastAge = incrementNumCount(lastAge, turns.length);

  if (turns.length === 2019) {
    console.log(`Part 1: ${lastAge}`);
  }

  if (turns.length % 3000000 === 0) {
    console.log(`Up to turn ${turns.length}`);
  }
}

console.log(`Part 2: ${lastAge}`);