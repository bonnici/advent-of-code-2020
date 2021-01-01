import { readLinesInGroups } from '../lib';

const input = readLinesInGroups('src/day22/input.txt');
// console.log('input', input);

class CombatGame {
  public player1Cards: number[] = [];
  public player2Cards: number[] = [];
  public roundsPlayed = 0;

  constructor(groups: string[][]) {
    groups[0].shift();
    this.player1Cards = groups[0].map(c => parseInt(c, 10));

    groups[1].shift();
    this.player2Cards = groups[1].map(c => parseInt(c, 10));
  }

  public playRound(): boolean {
    this.roundsPlayed++;
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

    return this.player1Cards.length > 0 && this.player2Cards.length > 0;
  }

  public winnerScore(): number {
    if (this.player1Cards.length !== 0 && this.player2Cards.length !== 0) {
      throw new Error('No winner yet');
    }

    return this.calculateScore(this.player1Cards.length > 0 ? this.player1Cards: this.player2Cards);
  }

  private calculateScore(cards: number[]): number {
    let score = 0;
    let curMultiplier = cards.length;
    for (const card of cards) {
      score += card * curMultiplier;
      curMultiplier--;
    }
    return score;
  }
}

const game = new CombatGame(input);
// console.log('game', game);

let moreRounds = false;
do {
  moreRounds = game.playRound();
} while (moreRounds)

// console.log('final cards', game);

console.log(`Part 1: ${game.winnerScore()}`);
