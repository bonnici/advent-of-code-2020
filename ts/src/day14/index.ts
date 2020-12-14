import { readLines } from '../lib';

const input = readLines('src/day14/input.txt');
// console.log('input', input);

const memoryRegex = /mem\[(?<address>\d+)] = (?<binary>[\d]+)/;
const memory = new Map<number, number>();
let bitMask = '';

// tslint:disable:no-bitwise
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

for (const line of input) {
  if (line.indexOf('mask') === 0) {
    bitMask = line.substr(7);
    // console.log('new bitmask', bitMask);
  } else if (line.indexOf('mem') === 0) {
    const matches = line.match(memoryRegex);
    const address = parseInt(matches?.groups?.address || '-1', 10);
    const binary = parseInt(matches?.groups?.binary || '-1', 10);

    if (isNaN(address) || address < 0 || isNaN(binary) || binary < 0) {
      throw new Error(`Unexpected memory line: ${line}`);
    }

    memory.set(address, applyMask(bitMask, binary));
  } else {
    throw new Error(`Unexpected line: ${line}`);
  }
}

let sum = 0n;
for (const [addr, value] of memory.entries()) {
  console.log('memory', { addr, value });
  sum += BigInt(value);
}

console.log(`Part 1: ${sum}`);
// 750357508873 too low