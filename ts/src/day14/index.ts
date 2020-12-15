import { readLines } from '../lib';

const input = readLines('src/day14/input.txt').filter(line => !!line);
// console.log('input', input);

const memoryRegex = /mem\[(?<address>\d+)] = (?<decimal>[\d]+)/;
// const memory = new Map<number, number>();
const memory = new Map<number, string>();
const memoryPart2 = new Map<number, number>();
let bitMask = '';

// tslint:disable:no-bitwise

/*
const applyMask = (mask: string, binary: number): number => {

  const orMask = bitMask.replace(/X/g, '0');
  const orMaskNum = parseInt(orMask, 2);
  const andMask = bitMask.replace(/X/g, '1');
  const andMaskNum = parseInt(andMask, 2);


  let result = binary;
  result |= orMaskNum;
  result &= andMaskNum;

  // console.log('applyMask', { mask, binary, orMask, orMaskNum, andMask, andMaskNum, result });

  return result >>> 0; // Force conversion to unsigned int
}
*/

const applyMask = (mask: string, decimal: number): string => {
  const binary = decimal.toString(2);
  const maskedBinary = [];

  for (let i = 0; i < mask.length; i++) {
    const maskBit = mask[mask.length - 1 - i];

    const binaryIdx = binary.length - 1 - i;
    const binaryBit = binaryIdx >= 0 ? binary[binaryIdx] : '0';

    const resultBit = maskBit !== 'X' ? maskBit : binaryBit;
    maskedBinary.unshift(resultBit);
  }

  const joined = maskedBinary.join('');

  // console.log('applyMask', { mask, decimal, binary, joined });
  return joined;
}

const applyToMemoryPart2Recursive = (floating: string, value: number) => {
  const nextXIndex = floating.indexOf('X');

  if (nextXIndex === -1) {
    const address = parseInt(floating, 2);
    memoryPart2.set(address, value);
    return;
  }

  applyToMemoryPart2Recursive(floating.replace('X', '1'), value);
  applyToMemoryPart2Recursive(floating.replace('X', '0'), value);
}

const setMemoryPart2 = (mask: string, address: number, value: number) => {
  const binary = address.toString(2);
  const maskedBinary = [];

  for (let i = 0; i < mask.length; i++) {
    const maskBit = mask[mask.length - 1 - i];

    const binaryIdx = binary.length - 1 - i;
    const binaryBit = binaryIdx >= 0 ? binary[binaryIdx] : '0';

    if (maskBit === '0') {
      maskedBinary.unshift(binaryBit);
    } else {
      maskedBinary.unshift(maskBit);
    }
  }

  const joined = maskedBinary.join('');

  // console.log('applyMask', { mask, address, value, binary, joined });

  applyToMemoryPart2Recursive(joined, value);
}

for (const line of input) {
  if (line.indexOf('mask') === 0) {
    bitMask = line.substr(7);
    // console.log('new bitmask', bitMask);
  } else if (line.indexOf('mem') === 0) {
    const matches = line.match(memoryRegex);
    const address = parseInt(matches?.groups?.address || '-1', 10);
    const decimal = parseInt(matches?.groups?.decimal || '-1', 10);

    if (isNaN(address) || address < 0 || isNaN(decimal) || decimal < 0) {
      throw new Error(`Unexpected memory line: ${line}`);
    }

    memory.set(address, applyMask(bitMask, decimal));
    setMemoryPart2(bitMask, address, decimal)
  } else {
    throw new Error(`Unexpected line: ${line}`);
  }
}

let sum = 0;
for (const [addr, value] of memory.entries()) {
  // console.log('memory', { addr, value });
  sum += parseInt(value, 2);
}

console.log(`Part 1: ${sum}`);


let sumPart2 = 0;
for (const [addr, value] of memoryPart2.entries()) {
  // console.log('memory', { addr, value });
  sumPart2 += value;
}

console.log(`Part 2: ${sumPart2}`);
