import { readLines } from '../lib';

const input = readLines('src/day23/sample.txt');
// console.log('input', input);

const parsed = input[0].split('').map(c => parseInt(c, 10));
// console.log('parsed', parsed);

class CupGame {
  public cups: number[];
  public currentCupIndex: number;
  public curMove: number;

  constructor(cups: number[], numCups: number) {
    this.cups = cups;
    this.currentCupIndex = 0;
    this.curMove = 1;
  }

  public play(moves: number) {
    for (let i = 0; i < moves; i++) {
      game.move();
    }
    console.log(`-- final --`);
    game.printCups();
  }

  public move() {
    // assuming cups have values 1-9

    console.log(`-- move ${this.curMove} --`);
    this.printCups();
    if (this.curMove % 100000 === 0) {
      console.log(`-- move ${this.curMove} --`);
    }

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
const game = new CupGame(parsed, parsed.length);
game.play(100);
console.log(`Part 1: ${game.labels()}`)
*/

const game = new CupGame(parsed, 20);
game.play(10);

/*
const gamePt2 = new CupGame(parsed, 1000000);
gamePt2.play(10000000);
console.log(`Part 2: ${gamePt2.part2()}`)
*/