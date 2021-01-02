import { readLines } from '../lib';
import {start} from "repl";

const input = readLines('src/day23/sample.txt');
// console.log('input', input);

const parsed = input[0].split('').map(c => parseInt(c, 10));
// console.log('parsed', parsed);

class CupGame {
  public cups: number[];
  public currentCupIndex: number;
  public curMove: number;
  public cupsToIndex: Map<number, number> = new Map();

  constructor(cups: number[], numCups: number) {
    this.cups = cups;

    let nextCup = cups.length + 1;
    while (cups.length < numCups) {
      this.cups.push(nextCup)
      nextCup++;
    }

    this.reindexCups(0);

    this.currentCupIndex = 0;
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
    if (this.curMove % 10 === 0) {
      console.log(`-- move ${this.curMove} --`);
    }

    const currentCup = this.cups[this.currentCupIndex];

    const pickedUp = [];
    for (let i = 0; i < 3; i++) {
      pickedUp.push(this.pickUpFromRight(this.currentCupIndex));
    }
    // console.log(`pick up: ${pickedUp.join(', ')}`);

    const destinationCup = this.destinationCup(currentCup, pickedUp);
    let destinationIndex = this.findIndex(destinationCup);
    if (destinationIndex > this.currentCupIndex) {
      destinationIndex -= 3;
    }
    // console.log(`destination: ${destinationCup} (@${destinationIndex})`);

    if (destinationIndex === this.cups.length - 1) {
      this.cups.push(...pickedUp);
      this.reindexCups(this.cups.length - 4);
    } else {
      this.cups.splice(destinationIndex + 1, 0, ...pickedUp);
      this.reindexCups(destinationIndex);
    }

    const newCurrentCupIndex = this.findIndex(currentCup);
    this.currentCupIndex = this.indexWithWrap(newCurrentCupIndex + 1);
    this.curMove++;
    // console.log();
  }

  public part1() {
    const oneIndex = this.findIndex(1);
    if (oneIndex === -1) {
      throw new Error('Could not find a 1');
    }

    const result = [];
    for (let i = 1; i <= this.cups.length; i++) {
      result.push(this.cups[this.indexWithWrap(oneIndex + i)]);
    }
    return result.filter(c => c !== 1).join('');
  }

  public part2() {
    // todo
    return 0;
  }

  public printCups() {
    const currentCup = this.cups[this.currentCupIndex];
    console.log(`cups: ${this.cups.map(c => c === currentCup ? `(${c})` : c).join(' ')}`);
  }

  private reindexCups(startingIndex: number) {
    for (let i = startingIndex; i < this.cups.length; i++) {
      const cup = this.cups[i];
      this.cupsToIndex.set(cup, i);
    }
  }

  private destinationCup(currentCup: number, pickedUp: number[]) {
    let highestCup = this.cups.length + pickedUp.length
    while (pickedUp.findIndex(c => c === highestCup) > -1) {
      highestCup--;
    }

    let destinationCup = currentCup === 1 ? highestCup : currentCup - 1;
    while (pickedUp.findIndex(c => c === destinationCup) > -1) {
      destinationCup = destinationCup === 1 ? highestCup : destinationCup - 1;
    }
    return destinationCup;
  }

  private pickUpFromRight(index: number) {
    const wrappedIndex = index >= this.cups.length - 1 ? 0 : index + 1;
    const result = this.cups[wrappedIndex];
    this.cups.splice(wrappedIndex, 1);
    return result;
  }

  private findIndex(cup: number): number {
    // return this.cups.findIndex(c => c === cup);
    const index = this.cupsToIndex.get(cup);
    if (index === undefined) {
      throw new Error('Cup not in map');
    }
    return index;
  }

  private indexWithWrap(index: number) {
    return index >= this.cups.length ? index - this.cups.length : index;
  }
}
/*
const game = new CupGame(parsed, parsed.length);
game.play(10);
console.log(`Part 1: ${game.part1()}`);
*/

const gamePt2 = new CupGame(parsed, 1000000);
gamePt2.play(10000000);
console.log(`Part 2: ${gamePt2.part2()}`);
