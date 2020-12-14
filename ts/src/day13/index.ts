import { readLines } from '../lib';

const input = readLines('src/day13/input.txt');
console.log('input', input);

const curTime = parseInt(input[0], 10);
const busIds = input[1].split(',').filter(n => n !== 'x').map(n => parseInt(n, 10));
const busIdsWithDelay = input[1]
  .split(',')
  .map((id, delay) => ({ id: parseInt(id, 10), delay }))
  .filter(b => !isNaN(b.id));

console.log('parsed', { curTime, busIds, busIdsWithDelay });

let bestWait = Number.MAX_SAFE_INTEGER;
let bestBus = 0;

for (const bus of busIds) {
  const minutesAgo = curTime % bus;
  if (minutesAgo === 0) {
    bestWait = 0;
    bestBus = bus;
  } else {
    const wait = (minutesAgo * -1) + bus;
    bestWait = Math.min(bestWait, wait);
    if (wait === bestWait) {
      bestBus = bus;
    }
  }
}

console.log('results', { bestWait, bestBus });
console.log(`Part 1: ${bestWait * bestBus}`);

const wolframInput = busIdsWithDelay.map(b => `(x+${b.delay}) mod ${b.id} == 0`).join(', ');
console.log(`Part 2: https://www.wolframalpha.com/input/?i=${encodeURIComponent(wolframInput)}`);
// x = 3200966845281517 n + 640856202464541, n element Z
