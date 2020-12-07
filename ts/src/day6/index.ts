import { readLinesTemp } from '../lib';

const input = readLinesTemp('src/day6/input.txt');
console.log('input', input);

let sumOfCountsPt1 = 0;
let sumOfCountsPt2 = 0;
for (const group of input) {
  const joined = group.join('');
  console.log(`group joined: ${joined}`);

  const answersMap = new Map();
  for (const char of joined) {
    const curCount = answersMap.has(char) ? answersMap.get(char) : 0;
    answersMap.set(char, curCount + 1);
  }
  console.log(`group answers: ${answersMap.size}`);
  sumOfCountsPt1 += answersMap.size;

  let allAnswered = 0;
  answersMap.forEach((v: number) => {
    if (v === group.length) {
      allAnswered++;
    }
  });
  sumOfCountsPt2 += allAnswered;
}

console.log(`Part 1: ${sumOfCountsPt1}`);
console.log(`Part 2: ${sumOfCountsPt2}`);

