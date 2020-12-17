import { readLinesAsChars } from '../lib';

const input = readLinesAsChars('src/day17/input.txt');
console.log('input', input);

class Cube {
  constructor(public x: number, public y: number, public z: number) {}

  public hash(): string {
    return `${this.x}_${this.y}_${this.z}`;
  }
}

// tslint:disable-next-line:max-classes-per-file
class Cubes {
  private activeCubes: Cube[] = [];
  private activeCubeHashSet: Set<string> = new Set();
  private xRange = { min: 0, max: 0 };
  private yRange = { min: 0, max: 0 };
  private zRange = { min: 0, max: 0 };

  constructor(initialState: string[][]) {
    for (const [y, row] of initialState.entries()) {
      for (const [x, char] of row.entries()) {
        if (char === '#') {
          this.addCube(new Cube(x, y, 0));
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
          const curCube = new Cube(x, y, z);
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

    this.clearCubes();
    newActiveCubes.forEach((cube) => this.addCube(cube));

    console.log(`Finished cycle, ending with ${this.numActiveCubes} active cubes`);
  }

  private countNeighbours(cube: Cube): number {
    let neighbours = 0;

    for (let xDelta = -1; xDelta <= 1; xDelta++) {
      for (let yDelta = -1; yDelta <= 1; yDelta++) {
        for (let zDelta = -1; zDelta <= 1; zDelta++) {
          if (xDelta !== 0 || yDelta !== 0 || zDelta !== 0) {
            const xToCheck = cube.x + xDelta;
            const yToCheck = cube.y + yDelta;
            const zToCheck = cube.z + zDelta;
            const cubeToCheck = new Cube(xToCheck, yToCheck, zToCheck);
            if (this.activeCubeHashSet.has(cubeToCheck.hash())) {
              neighbours++;
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
  }

  private clearCubes() {
    this.activeCubes = [];
    this.activeCubeHashSet.clear();
  }
}

const cubes = new Cubes(input);
// console.log('cubes before', cubes);

for (let turn = 0; turn < 6; turn++) {
  cubes.cycle();
  // console.log('cubes after cycle', cubes);
}

console.log(`Part 1: ${cubes.numActiveCubes}`)