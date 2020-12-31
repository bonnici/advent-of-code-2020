import { readLinesInGroups } from '../lib';
import {start} from "repl";

const input = readLinesInGroups('src/day20/input.txt');
// console.log('input', input);

enum Neighbour {
  RIGHT = 0,
  BOTTOM = 1,
  LEFT = 2,
  TOP = 3,
}

class Tile {
  public index: number;
  public edgeHashes: number[] = [];
  public flippedEdgeHashes: number[] = [];
  public neighbours: Set<Tile> = new Set();
  public pixels: string[];

  constructor(group: string[]) {
    const firstLine = group.shift() || '';
    this.pixels = group;
    this.index = parseInt(firstLine.replace(/[^\d]/g, ''), 10);
    if (isNaN(this.index)) {
      throw new Error(`Invalid first line: ${firstLine}`);
    }

    this.recalculateEdges();
  }

  public get topEdge() {
    return this.pixels[0];
  }

  public get rightEdge() {
    return this.pixels.map(line => line.charAt(line.length - 1)).join('');
  }

  public get bottomEdge() {
    return this.pixels[this.pixels.length - 1];
  }

  public get leftEdge() {
    return this.pixels.map(line => line.charAt(0)).join('');
  }

  public hasEdge(hash: number, allowFlipped: boolean) {
    const hasEdge = this.edgeHashes.includes(hash);
    const hasFlippedEdge = allowFlipped && this.flippedEdgeHashes.includes(hash);
    return hasEdge || hasFlippedEdge;
  }

  public addNeighbour(tile: Tile) {
    this.neighbours.add(tile);
  }

  public getNeighbour(neighbourDir: Neighbour, allowFlipped: boolean): Tile | null {
    let edge;
    switch (neighbourDir) {
      case Neighbour.LEFT:
        edge = this.leftEdge;
        break;
      case Neighbour.BOTTOM:
        edge = this.bottomEdge;
        break;
      case Neighbour.RIGHT:
        edge = this.rightEdge;
        break;
      case Neighbour.TOP:
        edge = this.topEdge;
        break;
    }

    const hash = Tile.calculateHash(edge, false);

    for (const neighbour of this.neighbours) {
      if (neighbour.hasEdge(hash, allowFlipped)) {
        return neighbour;
      }
    }

    return null;
  }

  public rotate() {
    // Should probably rotate a specific number of times instead of one at a time
    this.pixels = Tile.staticRotate(this.pixels);
    this.recalculateEdges();
  }

  public static staticRotate(pixels: string[]) {
    // Should probably rotate a specific number of times instead of one at a time
    const newPixels: string[] = [];

    for (let i = 0; i < pixels[0].length; i++) {
      const newRow = [];
      for (let j = pixels.length - 1; j >= 0; j--) {
        newRow.push(pixels[j].charAt(i));
      }
      newPixels.push(newRow.join(''));
    }

    return newPixels;
  }

  public flip() {
    this.pixels = Tile.staticFlip(this.pixels);
    this.recalculateEdges();
  }

  public static staticFlip(pixels: string[]) {
    return pixels.map(str => str.split('').reverse().join(''));
  }

  private recalculateEdges() {
    const topEdge = this.topEdge;
    const rightEdge = this.rightEdge;
    const bottomEdge = this.bottomEdge;
    const leftEdge = this.leftEdge;

    // console.log(`Edges: ${topEdge} ${rightEdge} ${bottomEdge} ${leftEdge}`)

    this.edgeHashes = [];
    this.flippedEdgeHashes = [];

    this.edgeHashes.push(Tile.calculateHash(topEdge, false));
    this.flippedEdgeHashes.push(Tile.calculateHash(topEdge, true));

    this.edgeHashes.push(Tile.calculateHash(rightEdge, false));
    this.flippedEdgeHashes.push(Tile.calculateHash(rightEdge, true));

    this.edgeHashes.push(Tile.calculateHash(bottomEdge, false));
    this.flippedEdgeHashes.push(Tile.calculateHash(bottomEdge, true));

    this.edgeHashes.push(Tile.calculateHash(leftEdge, false));
    this.flippedEdgeHashes.push(Tile.calculateHash(leftEdge, true));
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
const corners = [];

for (const tile of tiles) {
  let edgeMatches = 0;
  for (const otherTile of tiles) {
    if (tile === otherTile) {
      continue;
    }

    if (tile.edgeHashes.some(hash => otherTile.hasEdge(hash, true))
      || tile.flippedEdgeHashes.some(hash => otherTile.hasEdge(hash, true))) {
      tile.addNeighbour(otherTile);
      edgeMatches++;
    }
  }

  // console.log(`Tile ${tile.index} has ${edgeMatches} edge matches`);

  if (edgeMatches === 2) {
    corners.push(tile);
    part1 *= tile.index;
  }
}

if (corners.length === 4) {
  console.log(`Part 1: ${part1}`);
} else {
  console.log(`Bad corner count ${corners.length}`);
}


// console.log('corner 0', corners[0]);
// console.log('corner 0 neighbours', [...corners[0].neighbours.values()].map(t => t.index));

// tslint:disable-next-line:max-classes-per-file
class Image {
  private stitchedTiles: Tile[][] = [];
  private stitchedPixels: string[][] = [];

  constructor(startingTile: Tile) {
    while (!startingTile.getNeighbour(Neighbour.RIGHT, true) || !startingTile.getNeighbour(Neighbour.BOTTOM, true)) {
      startingTile.rotate();
    }

    let rowStart: Tile | null = startingTile;
    do {
      this.addRow();
      this.addTile(rowStart);
      this.addRightNeighbors(rowStart);
      const bottomNeighbour: Tile | null = rowStart.getNeighbour(Neighbour.BOTTOM, true);
      if (bottomNeighbour) {
        Image.alignNeighbour(rowStart, bottomNeighbour, Neighbour.TOP);
      }
      rowStart = bottomNeighbour;
    } while (!!rowStart)
  }

  private addRightNeighbors(tile: Tile) {
    const rightNeighbour = tile.getNeighbour(Neighbour.RIGHT, true);
    if (rightNeighbour) {
      Image.alignNeighbour(tile, rightNeighbour, Neighbour.LEFT);
      this.addTile(rightNeighbour);
      this.addRightNeighbors(rightNeighbour);
    }
  }

  private static alignNeighbour(tile: Tile, neighbourTile: Tile, alignDir: Neighbour) {
    let otherNeighbour = neighbourTile.getNeighbour(alignDir, false);
    let numRotations = 0;
    while (otherNeighbour !== tile && numRotations < 9) {
      if (numRotations === 4) {
        neighbourTile.flip();
      } else {
        neighbourTile.rotate();
      }
      otherNeighbour = neighbourTile.getNeighbour(alignDir, false);

      numRotations++;
    }

    if (numRotations === 9) {
      throw new Error('Too many rotations');
    }
  }

  private addRow() {
    this.stitchedTiles.push([]);
  }

  private addTile(tile: Tile) {
    this.stitchedTiles[this.stitchedTiles.length - 1].push(tile);
  }

  public stitch() {
    for (const tileRow of this.stitchedTiles) {
      for (let rowInTiles = 1; rowInTiles < tileRow[0].pixels.length - 1; rowInTiles++) {
        const stitchedRow = tileRow.map(tile => {
          const row = tile.pixels[rowInTiles];
          return row.substr(1, row.length - 2);
        }).join('');
        this.stitchedPixels.push(stitchedRow.split(''));
      }
    }
  }

  public findMonsters() {
    for (let i = 0; i < this.stitchedPixels.length; i++) {
      for (let j = 0; j < this.stitchedPixels[i].length; j++) {
        this.findMonsterAt(j, i, 0, false);
        this.findMonsterAt(j, i, 0, true);
        this.findMonsterAt(j, i, 1, false);
        this.findMonsterAt(j, i, 1, true);
        this.findMonsterAt(j, i, 2, false);
        this.findMonsterAt(j, i, 2, true);
        this.findMonsterAt(j, i, 3, false);
        this.findMonsterAt(j, i, 3, true);
      }
    }
  }

  private findMonsterAt(x: number, y: number, rotations: number, flipped: boolean) {
    let targets = [
      '                  # ',
      '#    ##    ##    ###',
      ' #  #  #  #  #  #   ',
    ];

    if (flipped) {
      targets = Tile.staticFlip(targets);
    }
    for (let i = 0; i < rotations; i++) {
      targets = Tile.staticRotate(targets);
    }

    if (x + targets[0].length > this.stitchedPixels[0].length || y + targets.length > this.stitchedPixels.length) {
      return;
    }

    if (this.findMonsterAdjusted(x, y, targets)) {
      console.log(`Found monster at x=${x}, y=${y} with rotations=${rotations} and flipped=${flipped}`);
      for (let row = 0; row < targets.length; row++) {
        for (let col = 0; col < targets[0].length; col++) {
          if (targets[row].charAt(col) === '#') {
            this.stitchedPixels[y + row][x + col] = 'O';
          }
        }
      }
    }
  }

  private findMonsterAdjusted(x: number, y: number, targets: string[]): boolean {
    for (let row = 0; row < targets.length; row++) {
      for (let col = 0; col < targets[0].length; col++) {
        if (targets[row].charAt(col) === '#') {
          if (this.stitchedPixels[y + row][x + col] === '.') {
            return false;
          }
        }
      }
    }
    return true;
  }

  public countHashes() {
    let count = 0;
    for (const row of this.stitchedPixels) {
      count += row.filter(ch => ch === '#').length;
    }
    return count;
  }
}

const image = new Image(corners[0]);
image.stitch();
image.findMonsters();
const part2 = image.countHashes();
console.log(`Part 2: ${part2}`);

