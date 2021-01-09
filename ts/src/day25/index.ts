import { readLines } from '../lib';

const input = readLines('src/day25/input.txt');
// console.log('input', input);

const cardPublicKey = parseInt(input[0], 10);
const doorPublicKey = parseInt(input[1], 10);
// console.log('cardPublicKey', cardPublicKey);
// console.log('doorPublicKey', doorPublicKey);

const transformSubjectNumber = (subjectNumber: number, loopSize: number): number => {
  let result = 1;
  for (let i = 0; i < loopSize; i++) {
    result = result * subjectNumber;
    result = result % 20201227;
  }
  return result;
}

const transformSubjectNumberIterative = (subjectNumber: number, lastValue: number): number => {
  let newValue = lastValue;
  newValue *= subjectNumber;
  newValue %= 20201227;
  return newValue;
}

const MAX_LOOP_SIZE = 100000000;

let cardLoopSize: number | undefined;
let doorLoopSize: number | undefined;
let value = 1;

for (let curLoopSize = 1; curLoopSize <= MAX_LOOP_SIZE; curLoopSize++) {
  if (curLoopSize % 100000 === 0) {
    // console.log(`Checking loop size ${curLoopSize}`);
  }

  value = transformSubjectNumberIterative(7, value);

  if (value === cardPublicKey) {
    cardLoopSize = curLoopSize;
  }
  if (value === doorPublicKey) {
    doorLoopSize = curLoopSize;
  }

  if (cardLoopSize && doorLoopSize) {
    break;
  }
}

if (cardLoopSize === undefined || doorLoopSize === undefined) {
  throw new Error('Max loop size reached');
}

console.log('cardLoopSize', cardLoopSize);
console.log('doorLoopSize', doorLoopSize);

const encryptionKey = transformSubjectNumber(doorPublicKey, cardLoopSize);
const encryptionKey2 = transformSubjectNumber(cardPublicKey, doorLoopSize);

if (encryptionKey !== encryptionKey2) {
  throw new Error('Invalid encryption key');
}

console.log(`Part 1: ${encryptionKey}`);