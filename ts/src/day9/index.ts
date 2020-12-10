import { readLinesAsInts } from '../lib';

const input = readLinesAsInts('src/day9/sample.txt');
// console.log('input', input);

interface Entry {
    num: number;
    sums: Map<number, number>;
}

const entries: Entry[] = [];
const preambleSize = 5;

for (let i = 0; i < preambleSize; i++) {
    const curNum = input[i];
    const entry = { num: curNum, sums: new Map<number, number>() };
    for (let j = 0; j < preambleSize; j++) {
        if (i !== j) {
            const otherNum = input[j];
            const sum = curNum + otherNum;
            if (entry.sums.has(sum)) {
                console.error('duplicate sum', { entry, sum, otherNum });
            }
            entry.sums.set(sum, otherNum);
        }
    }
    entries.push(entry);
}

input.splice(0, preambleSize);

// console.log('entries', entries);
// console.log('input', input);

const findSum = (num: number): number => {
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry.sums.has(num)) {
            return i;
        }
    }
    return -1;
}

while (input.length > 0) {
    const curNum = input.shift();
    if (curNum === undefined) {
        break;
    }

    const sumIndex = findSum(curNum);
    if (sumIndex === -1) {
        console.log(`Part 1: ${curNum}`);
        break;
    }

    const entryToRemove = entries[sumIndex];
    const sum = curNum + entryToRemove.num;
    entries.splice(sumIndex, 1);

    for (const entry of entries) {
        for (const [otherNum, curSum] of entry.sums.entries()) {
            if (otherNum === curNum && curSum === sum) {
                entry.sums.delete(curSum);
            }
        }
        entry.sums.set(sum, curNum);
    }
}