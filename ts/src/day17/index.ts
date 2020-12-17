import { readLinesAsChars } from '../lib';

const input = readLinesAsChars('src/day17/input.txt');
console.log('input', input);

class Cube {
  constructor(public x: number, public y: number, public z: number, public w: number | null) {}

  public hash(): string {
    if (this.w === null) {
      return `${this.x}_${this.y}_${this.z}`;
    } else {
      return `${this.x}_${this.y}_${this.z}_${this.w}`;
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
class Cubes {
  private activeCubes: Cube[] = [];
  private activeCubeHashSet: Set<string> = new Set();
  private xRange = { min: 0, max: 0 };
  private yRange = { min: 0, max: 0 };
  private zRange = { min: 0, max: 0 };
  private wRange = { min: 0, max: 0 };
  private hasWDim = false;

  constructor(initialState: string[][], hasWDim: boolean) {
    this.hasWDim = hasWDim;
    for (const [y, row] of initialState.entries()) {
      for (const [x, char] of row.entries()) {
        if (char === '#') {
          this.addCube(new Cube(x, y, 0, hasWDim ? 0 : null));
        }
      }
    }
  }

  public get numActiveCubes() {
    return this.activeCubes.length;
  }

  public cycle() {
    console.log(`Cycling cubes, starting with ${this.numActiveCubes} active cubes`);

    const newActiveCubes: Cube[] = [];

    for (let x = this.xRange.min - 1; x <= this.xRange.max + 1; x++) {
      for (let y = this.yRange.min - 1; y <= this.yRange.max + 1; y++) {
        for (let z = this.zRange.min - 1; z <= this.zRange.max + 1; z++) {
          if (!this.hasWDim) {
            const curCube = new Cube(x, y, z, null);
            const isActive = this.activeCubeHashSet.has(curCube.hash());
            const numNeighbours = this.countNeighbours(curCube);

            if (
              (isActive && numNeighbours >= 2 && numNeighbours <= 3) ||
              (!isActive && numNeighbours === 3)
            ) {
              newActiveCubes.push(curCube);
            }
          } else {
            for (let w = this.wRange.min - 1; w <= this.wRange.max + 1; w++) {
              const curCube = new Cube(x, y, z, w);
              const isActive = this.activeCubeHashSet.has(curCube.hash());
              const numNeighbours = this.countNeighbours(curCube);

              if (
                (isActive && numNeighbours >= 2 && numNeighbours <= 3) ||
                (!isActive && numNeighbours === 3)
              ) {
                newActiveCubes.push(curCube);
              }
            }
          }
        }
      }
    }

    this.clearCubes();
    newActiveCubes.forEach((cube) => this.addCube(cube));

    console.log(`Finished cycle, ending with ${this.numActiveCubes} active cubes`);
  }

  private countNeighbours(cube: Cube): number {
    let neighbours = 0;

    for (let xDelta = -1; xDelta <= 1; xDelta++) {
      for (let yDelta = -1; yDelta <= 1; yDelta++) {
        for (let zDelta = -1; zDelta <= 1; zDelta++) {
          if (!this.hasWDim) {
            if (xDelta !== 0 || yDelta !== 0 || zDelta !== 0) {
              const xToCheck = cube.x + xDelta;
              const yToCheck = cube.y + yDelta;
              const zToCheck = cube.z + zDelta;
              const cubeToCheck = new Cube(xToCheck, yToCheck, zToCheck, null);
              if (this.activeCubeHashSet.has(cubeToCheck.hash())) {
                neighbours++;
              }
            }
          } else {
            for (let wDelta = -1; wDelta <= 1; wDelta++) {
              if (xDelta !== 0 || yDelta !== 0 || zDelta !== 0 || wDelta !== 0) {
                const xToCheck = cube.x + xDelta;
                const yToCheck = cube.y + yDelta;
                const zToCheck = cube.z + zDelta;
                const wToCheck = (cube.w || 0) + wDelta;
                const cubeToCheck = new Cube(xToCheck, yToCheck, zToCheck, wToCheck);
                if (this.activeCubeHashSet.has(cubeToCheck.hash())) {
                  neighbours++;
                }
              }
            }
          }
        }
      }
    }

    return neighbours;
  }

  private addCube(cube: Cube) {
    this.activeCubes.push(cube);
    this.activeCubeHashSet.add(cube.hash());

    this.xRange.min = Math.min(this.xRange.min, cube.x);
    this.xRange.max = Math.max(this.xRange.max, cube.x);
    this.yRange.min = Math.min(this.yRange.min, cube.y);
    this.yRange.max = Math.max(this.yRange.max, cube.y);
    this.zRange.min = Math.min(this.zRange.min, cube.z);
    this.zRange.max = Math.max(this.zRange.max, cube.z);
    this.wRange.min = Math.min(this.wRange.min, cube.w || 0);
    this.wRange.max = Math.max(this.wRange.max, cube.w || 0);
  }

  private clearCubes() {
    this.activeCubes = [];
    this.activeCubeHashSet.clear();
  }
}

const cubesPart1 = new Cubes(input, false);
// console.log('cubesPart1 before', cubesPart1);
const cubesPart2 = new Cubes(input, true);
// console.log('cubesPart2 before', cubesPart2);

for (let turn = 0; turn < 6; turn++) {
  cubesPart1.cycle();
  // console.log('cubesPart1 after cycle', cubes);
  cubesPart2.cycle();
  // console.log('cubesPart2 after cycle', cubes);
}

console.log(`Part 1: ${cubesPart1.numActiveCubes}`);
console.log(`Part 2: ${cubesPart2.numActiveCubes}`);