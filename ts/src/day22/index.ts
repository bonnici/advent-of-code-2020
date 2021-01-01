import { readLinesInGroups } from '../lib';

const input = readLinesInGroups('src/day22/input.txt');
// console.log('input', input);

let curGameNum = 1;

const cachedResults: Map<string, number> = new Map();

class CombatGame {
  public player1Cards: number[] = [];
  public player2Cards: number[] = [];
  public gameNum: number;
  public roundsPlayed = 0;
  public cardsHashes: Set<string> = new Set();
  public initialHash: string;
  public isSubGame;

  constructor(player1Cards: number[], player2Cards: number[], isSubGame: boolean) {
    this.player1Cards = player1Cards;
    this.player2Cards = player2Cards;
    this.gameNum = curGameNum;
    curGameNum++;
    this.initialHash = this.calculateHash();
    this.isSubGame = isSubGame;
  }

  public playGame(recursive: boolean): number {
    let winner: number | undefined;

    if (cachedResults.has(this.initialHash)) {
      winner = cachedResults.get(this.initialHash) as number;
      // console.log(`Returning winner ${winner} using cached result for hash ${this.initialHash}`);
      return winner;
    }

    // console.log(`Game ${this.gameNum} | P1 has ${this.player1Cards.length} cards, P2 has ${this.player2Cards.length} cards`);
    do {
      winner = recursive ? this.playRecursiveRound() : this.playRound();
    } while (winner === undefined)

    cachedResults.set(this.initialHash, winner);

    return winner;
  }

  public playRound(): number | undefined {
    this.roundsPlayed++;

    if (this.shouldHalt()) {
      return 1;
    }

    const player1Card = this.player1Cards.shift();
    const player2Card = this.player2Cards.shift();

    if (player1Card === undefined || player2Card === undefined) {
      throw new Error('Invalid round');
    }

    if (player1Card > player2Card) {
      // console.log(`Round ${this.roundsPlayed}: player 1 (${player1Card}) beats player 2 (${player2Card}) and wins the round`);
      this.player1Cards.push(player1Card, player2Card);
    } else {
      // console.log(`Round ${this.roundsPlayed}: player 2 (${player2Card}) beats player 1 (${player1Card}) and wins the round`);
      this.player2Cards.push(player2Card, player1Card);
    }

    if (this.player1Cards.length === 0) {
      return 2;
    } else if (this.player2Cards.length === 0) {
      return 1;
    }
    return undefined;
  }

  public playRecursiveRound(): number | undefined {
    this.roundsPlayed++;

    // console.log(`Round ${this.roundsPlayed} (Game ${this.gameNum}) | P1 has ${this.player1Cards.length} cards, P2 has ${this.player2Cards.length} cards`);
    if (this.gameNum === 1) {
      console.log(`Round ${this.roundsPlayed} (Game ${this.gameNum}) | P1 has ${this.player1Cards.length} cards, P2 has ${this.player2Cards.length} cards`);
    }

    if (this.shouldHalt()) {
      return 1;
    }

    const player1Card = this.player1Cards.shift();
    const player2Card = this.player2Cards.shift();

    if (player1Card === undefined || player2Card === undefined) {
      throw new Error('Invalid round');
    }

    if (this.player1Cards.length >= player1Card && this.player2Cards.length >= player2Card) {
      // console.log(`${player1Card} vs ${player2Card} - playing sub-game to determine winner`);

      const subGame = new CombatGame([...this.player1Cards].slice(0, player1Card), [...this.player2Cards].slice(0, player2Card), true);
      const p1Wins = subGame.playGame(true) === 1;

      if (p1Wins) {
        // console.log(`Player 1 wins sub-game`);
        this.player1Cards.push(player1Card, player2Card);
      } else {
        // console.log(`Player 2 wins sub-game`);
        this.player2Cards.push(player2Card, player1Card);
      }
    }
    else {
      if (player1Card > player2Card) {
        // console.log(`${player1Card} vs ${player2Card} - player 1 wins`);
        this.player1Cards.push(player1Card, player2Card);
      } else {
        // console.log(`${player1Card} vs ${player2Card} - player 2 wins`);
        this.player2Cards.push(player2Card, player1Card);
      }
    }

    if (this.player1Cards.length === 0) {
      return 2;
    } else if (this.player2Cards.length === 0) {
      return 1;
    }
    return undefined;
  }

  public winnerScore(): number {
    if (this.player1Cards.length !== 0 && this.player2Cards.length !== 0) {
      throw new Error('No winner yet');
    }

    return CombatGame.calculateScore(this.player1Cards.length > 0 ? this.player1Cards: this.player2Cards);
  }

  public calculateHash(): string {
    return `${this.player1Cards.join(',')}|${this.player2Cards.join(',')}`;
  }

  private shouldHalt(): boolean {
    const hash = this.calculateHash();
    if (this.cardsHashes.has(hash)) {
      // console.log(`Preventing recursion and forcing a win for player 1`);
      this.player2Cards = [];
      return true;
    }
    this.cardsHashes.add(hash);
    return false;
  }

  private static calculateScore(cards: number[]): number {
    let score = 0;
    let curMultiplier = cards.length;
    for (const card of cards) {
      score += card * curMultiplier;
      curMultiplier--;
    }
    return score;
  }
}

input[0].shift();
input[1].shift();
const gamePart1 = new CombatGame(input[0].map(c => parseInt(c, 10)), input[1].map(c => parseInt(c, 10)), false);
// console.log('gamePart1', gamePart1);

const part1Winner = gamePart1.playGame(false);
// console.log('final cards', game);
console.log(`Player ${part1Winner} wins part 1!`);
console.log(`Part 1: ${gamePart1.winnerScore()}`);

curGameNum = 1;
cachedResults.clear();
const gamePart2 = new CombatGame(input[0].map(c => parseInt(c, 10)), input[1].map(c => parseInt(c, 10)), false);
// console.log('gamePart2', gamePart2);

const part2Winner = gamePart2.playGame(true);
// console.log('final cards', game);
console.log(`Player ${part2Winner} wins part 2!`);
console.log(`Part 2: ${gamePart2.winnerScore()}`);