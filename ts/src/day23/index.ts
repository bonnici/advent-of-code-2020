import { readLines } from '../lib';

const input = readLines('src/day23/input.txt');
// console.log('input', input);

const parsed = input[0].split('').map(c => parseInt(c, 10));
// console.log('parsed', parsed);

class CupGamePart1 {
  public cups: number[];
  public currentCupIndex: number;
  public curMove: number;

  constructor(cups: number[]) {
    this.cups = cups;
    this.currentCupIndex = 0;
    this.curMove = 1;
  }

  public play(moves: number) {
    for (let i = 0; i < moves; i++) {
      this.move();
    }
    console.log(`-- final --`);
    this.printCups();
  }

  public move() {
    // assuming cups have values 1-9

    console.log(`-- move ${this.curMove} --`);
    this.printCups();

    const currentCup = this.cups[this.currentCupIndex];

    const pickedUp = [];
    for (let i = 0; i < 3; i++) {
      pickedUp.push(this.pickUpFromRight(this.currentCupIndex));
    }
    console.log(`pick up: ${pickedUp.join(', ')}`);

    let destinationCup = currentCup === 1 ? 9 : currentCup - 1;
    let destinationIndex = this.cups.findIndex(c => c === destinationCup && destinationCup !== currentCup);
    // could be much more efficient
    while (destinationIndex === -1) {
      destinationCup = destinationCup === 1 ? 9 : destinationCup - 1;
      destinationIndex = this.cups.findIndex(c => c === destinationCup && destinationCup !== currentCup);
    }
    console.log(`destination: ${destinationCup}`);

    if (destinationIndex === this.cups.length - 1) {
      this.cups.push(...pickedUp);
    } else {
      this.cups.splice(destinationIndex + 1, 0, ...pickedUp);
    }

    const newCurrentCupIndex = this.cups.findIndex(c => c === currentCup);
    this.currentCupIndex = this.indexWithWrap(newCurrentCupIndex + 1);
    this.curMove++;
    console.log();
  }

  public labels() {
    const oneIndex = this.cups.findIndex(c => c === 1);
    if (oneIndex === -1) {
      throw new Error('Could not find a 1');
    }

    const result = [];
    for (let i = 1; i <= this.cups.length; i++) {
      result.push(this.cups[this.indexWithWrap(oneIndex + i)]);
    }
    return result.filter(c => c !== 1).join('');
  }

  public printCups() {
    const currentCup = this.cups[this.currentCupIndex];
    console.log(`cups: ${this.cups.map(c => c === currentCup ? `(${c})` : c).join(' ')}`);
  }

  private pickUpFromRight(index: number) {
    const wrappedIndex = index >= this.cups.length - 1 ? 0 : index + 1;
    const result = this.cups[wrappedIndex];
    this.cups.splice(wrappedIndex, 1);
    return result;
  }

  private indexWithWrap(index: number) {
    return index >= this.cups.length ? index - this.cups.length : index;
  }
}

/*
const game = new CupGamePart1(parsed);
game.play(100);
console.log(`Part 1: ${game.labels()}`);
*/

// tslint:disable-next-line:max-classes-per-file
interface LinkedListCup {
  cupNum: number;
  nextCup: LinkedListCup | undefined;
}

// tslint:disable-next-line:max-classes-per-file
class CupGamePart2 {
  public cups: Map<number, LinkedListCup> = new Map();
  public numCups: number = 0;
  public currentCup: LinkedListCup | undefined = undefined;
  public firstCup: LinkedListCup | undefined = undefined;
  public curMove: number;

  constructor(cups: number[], numCups: number) {
    let lastCup: LinkedListCup | undefined;
    for (const cupNum of cups) {
      lastCup = this.addCup(cupNum, lastCup);
    }

    let nextCupNum = cups.length + 1;
    while (this.numCups < numCups) {
      lastCup = this.addCup(nextCupNum, lastCup);
      nextCupNum++;
    }
    console.log('Finished adding cups');

    // @ts-ignore
    lastCup.nextCup = this.firstCup;

    this.currentCup = this.firstCup;

    this.curMove = 1;
  }

  public play(moves: number) {
    for (let i = 0; i < moves; i++) {
      this.move();
    }
    // console.log(`-- final --`);
    // this.printCups();
  }

  public move() {
    // console.log(`-- move ${this.curMove} --`);
    // this.printCups();
    if (this.curMove % 100000 === 0) {
      console.log(`-- move ${this.curMove} --`);
    }

    const pickedUp = this.pickupCups();
    // console.log(`pick up: ${pickedUp.map(c => c.cupNum).join(', ')}`);

    const destinationCup = this.findDestinationCup(pickedUp);
    // console.log(`destination: ${destinationCup.cupNum}`);

    const tempCup = destinationCup.nextCup;
    destinationCup.nextCup = pickedUp[0];
    pickedUp[pickedUp.length - 1].nextCup = tempCup;

    this.currentCup = this.currentCup?.nextCup;
    this.curMove++;
    // console.log();
  }

  public part1() {
    const oneCup = this.findCup(1);
    if (!oneCup) {
      throw new Error('Could not find a 1');
    }

    const result = [];
    let curCup = oneCup;
    while (curCup.nextCup !== oneCup) {
      result.push(curCup.nextCup);
      curCup = curCup.nextCup as LinkedListCup;
    }
    return result.map(c => (c as LinkedListCup).cupNum).join('');
  }

  public part2() {
    const oneCup = this.findCup(1);
    if (!oneCup) {
      throw new Error('Could not find a 1');
    }

    const after1 = (oneCup.nextCup as LinkedListCup);
    const afterThat = (after1.nextCup as LinkedListCup);

    console.log(`Cups after 1: ${after1.cupNum}, ${afterThat.cupNum}`)

    return after1.cupNum * afterThat.cupNum;
  }

  public printCups() {
    const cupLabels = [];
    let cupToPrint: LinkedListCup = this.firstCup as LinkedListCup;
    do {
      cupLabels.push(cupToPrint.cupNum);
      cupToPrint = cupToPrint.nextCup as LinkedListCup;
    } while (cupToPrint !== this.firstCup)

    console.log(`cups: ${cupLabels.map(c => c === this.currentCup?.cupNum ? `(${c})` : c).join(' ')}`);
  }

  private findCup(cupNum: number): LinkedListCup | undefined {
    return this.cups.get(cupNum);
  }

  private pickupCups(): LinkedListCup[] {
    const result = [];
    let curCup = this.currentCup;
    for (let i = 0; i < 3; i++) {
      const nextCup = curCup?.nextCup as LinkedListCup;
      result.push(nextCup);
      curCup = nextCup;
    }

    (this.currentCup as LinkedListCup).nextCup = curCup?.nextCup;

    return result;
  }

  private findDestinationCup(pickedUp: LinkedListCup[]): LinkedListCup {
    let targetCupNum = (this.currentCup as LinkedListCup).cupNum;
    let destinationCup;
    do {
      targetCupNum--;
      if (targetCupNum < 1) {
        targetCupNum = this.numCups;
      }

      if (pickedUp.findIndex(c => c.cupNum === targetCupNum) === -1) {
        destinationCup = this.findCup(targetCupNum) as LinkedListCup;
      }
    } while (!destinationCup)

    return destinationCup;
  }

  private addCup(cupNum: number, lastCup: LinkedListCup | undefined) {
    const curCup: LinkedListCup = { cupNum, nextCup: undefined };

    if (this.firstCup === undefined) {
      this.firstCup = curCup;
    }

    if (lastCup) {
      lastCup.nextCup = curCup;
    }

    this.cups.set(cupNum, curCup);
    this.numCups++;

    return curCup;
  }
}

const gamePt1 = new CupGamePart2(parsed, parsed.length);
gamePt1.play(100);
console.log(`Part 1: ${gamePt1.part1()}`);

const gamePt2 = new CupGamePart2(parsed, 1000000);
gamePt2.play(10000000);
console.log(`Part 2: ${gamePt2.part2()}`);
