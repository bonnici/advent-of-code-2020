import { readLines } from '../lib';

const input = readLines('src/day25/sample.txt');
console.log('input', input);

const cardPublicKey = parseInt(input[0], 10);
const doorPublicKey = parseInt(input[1], 10);
console.log('cardPublicKey', cardPublicKey);
console.log('doorPublicKey', doorPublicKey);