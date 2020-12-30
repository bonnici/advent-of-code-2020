import { readLinesInGroups } from '../lib';

const input = readLinesInGroups('src/day20/input.txt');
// console.log('input', input);

class Tile {
  public index: number;
  public edgeHashes: number[] = [];

  constructor(group: string[]) {
    const firstLine = group.shift() || '';
    this.index = parseInt(firstLine.replace(/[^\d]/g, ''), 10);
    if (isNaN(this.index)) {
      throw new Error(`Invalid first line: ${firstLine}`);
    }

    const topEdge = group[0];
    const rightEdge = group.map(line => line.charAt(line.length - 1)).join('');
    const bottomEdge = group[group.length - 1];
    const leftEdge = group.map(line => line.charAt(0)).join('');

    // console.log(`Edges: ${topEdge} ${rightEdge} ${bottomEdge} ${leftEdge}`)

    this.edgeHashes.push(Tile.calculateHash(topEdge, false));
    this.edgeHashes.push(Tile.calculateHash(topEdge, true));

    this.edgeHashes.push(Tile.calculateHash(rightEdge, false));
    this.edgeHashes.push(Tile.calculateHash(rightEdge, true));

    this.edgeHashes.push(Tile.calculateHash(bottomEdge, false));
    this.edgeHashes.push(Tile.calculateHash(bottomEdge, true));

    this.edgeHashes.push(Tile.calculateHash(leftEdge, false));
    this.edgeHashes.push(Tile.calculateHash(leftEdge, true));
  }

  public hasEdge(hash: number) {
    return this.edgeHashes.includes(hash);
  }

  private static calculateHash(edge: string, flipped: boolean): number {
    const toHash = flipped ? edge.split('').reverse().join('') : edge;

    let result = 0;
    let curMultiplier = 1;

    for (const ch of toHash.split('')) {
      if (ch === '#') {
        result += curMultiplier;
      }

      // tslint:disable-next-line:no-bitwise
      curMultiplier <<= 1;
    }

    // console.log(`Hash for ${toHash} = ${result}`)
    return result;
  }
}

const tiles = [];

for (const group of input) {
  if (group.length > 1) {
    tiles.push(new Tile(group));
  }
}

let part1 = 1;
let cornerCount = 0;

for (const tile of tiles) {
  let edgeMatches = 0;
  for (const otherTile of tiles) {
    if (tile === otherTile) {
      continue;
    }

    if (tile.edgeHashes.some(hash => otherTile.hasEdge(hash))) {
      edgeMatches++;
    }
  }

  // console.log(`Tile ${tile.index} has ${edgeMatches} edge matches`);

  if (edgeMatches === 2) {
    cornerCount++;
    part1 *= tile.index;
  }
}

if (cornerCount === 4) {
  console.log(`Part 1: ${part1}`);
} else {
  console.log(`Bad corner count ${cornerCount}`);
}