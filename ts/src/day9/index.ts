import { readLinesAsInts } from '../lib';

const input = readLinesAsInts('src/day9/input.txt');
// console.log('input', input);

class Entry {
    private readonly num: number;
    private sumsList: number[];

    constructor(num: number) {
        this.num = num;
        this.sumsList = [];
    }

    get number() {
        return this.num;
    }

    addNumber(otherNum: number) {
        this.sumsList.push(this.num + otherNum);
    }

    hasSum(sum: number) {
        return this.sumsList.some((n: number) => n === sum);
    }

    removeFirstSum() {
        if (this.sumsList.length < 1) {
            return;
        }
        this.sumsList.unshift();
    }
}

// tslint:disable-next-line:max-classes-per-file
class Entries {
    private readonly preambleSize: number;
    private entriesList: Entry[] = [];

    constructor(preambleSize: number) {
        this.preambleSize = preambleSize;
    }

    processNumber(num: number): boolean {
        if (this.entriesList.length < this.preambleSize) {
            this.addToPreamble(num);
            return true;
        } else {
            return this.checkSum(num);
        }
    }

    private addToPreamble(num: number) {
        console.log('adding number to preamble', { num });

        const newEntry = new Entry(num);
        for (const entry of this.entriesList) {
            entry.addNumber(num);
            newEntry.addNumber(entry.number);
        }
        this.entriesList.push(newEntry);
    }

    private checkSum(num: number): boolean {
        console.log('searching for sum', { num });

        if (this.entriesList.every(entry => !entry.hasSum(num))) {
            return false;
        }

        this.entriesList.shift();
        this.entriesList.forEach(entry => entry.removeFirstSum());
        this.addToPreamble(num);

        return true;
    }
}

const entries = new Entries(25);
let badNum = undefined;

for (const curNum of input) {
    const ok = entries.processNumber(curNum);
    if (!ok) {
        badNum = curNum;
        console.log(`Part 1: ${curNum}`);
        break;
    }
}

if (badNum === undefined) {
    throw new Error('Part 1 solution not found');
}

let found = false;
for (let i = 0; i < input.length && !found; i++) {
    console.log('finding contiguous set from index', { i });
    let curSum = input[i];

    for (let j = i + 1; j < input.length && curSum < badNum; j++) {
        curSum += input[j];
        if (curSum === badNum) {
            console.log('found result', { curSum, badNum, i, j, start: input[i], end: input[j] });

            let smallest = input[i];
            let largest = input[i];

            for (let k = i; k <= j; k++) {
                const curNum = input[k];
                smallest = Math.min(smallest, curNum);
                largest = Math.max(largest, curNum);
            }

            console.log('found min/max', { smallest, largest });

            console.log(`Part 2: ${smallest + largest}`);

            found = true;
            break;
        }
    }
}
