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
    const newPixels: string[] = [];

    for (let i = 0; i < this.pixels[0].length; i++) {
      const newRow = [];
      for (let j = this.pixels.length - 1; j >= 0; j--) {
        newRow.push(this.pixels[j].charAt(i));
      }
      newPixels.push(newRow.join(''));
    }

    this.pixels = newPixels;
    this.recalculateEdges();
  }

  public flip() {
    this.pixels = this.pixels.map(str => str.split('').reverse().join(''));
    this.recalculateEdges();
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

  constructor(startingTile: Tile) {
    while (!startingTile.getNeighbour(Neighbour.RIGHT, true) || !startingTile.getNeighbour(Neighbour.BOTTOM, true)) {
      console.log('before rotate', startingTile.pixels);
      startingTile.rotate();
      console.log('after rotate', startingTile.pixels);
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
    // todo loop through each tile, remove border, add to stitchedPixels array
  }

  public findMonsters() {
    // todo loop through each pixel and call findMonsterAt with all orientations/flipped
  }

  private findMonsterAt(x: number, y: number, rotations: number, flipped: boolean) {
    // todo check using hard-coded indicies
  }
}

const image = new Image(corners[0]);
image.stitch();
image.findMonsters();
// todo - count # characters

