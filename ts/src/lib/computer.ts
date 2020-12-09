export interface Instruction {
  operation: 'nop' | 'acc' | 'jmp';
  argument: number;
}

export enum ExitCode {
  CONTINUE = -1,
  OK = 0,
  INFINITE_LOOP = 1,
  INSTRUCTION_OUT_OF_BOUNDS = 2,
}

export class Computer {
  instructions: Instruction[];
  acc: number;
  iPtr: number;
  instructionSet: Set<number>;
  logOutput: boolean;

  static parseInstructions(input: string[]): Instruction[] {
    return input.map(line => {
      const operation = line.substr(0, 3);
      const argument = parseInt(line.substr(4), 10);

      if (['nop', 'acc', 'jmp'].indexOf(operation) === -1) {
        throw new Error(`Invalid operation ${operation}`);
      }

      return {
        operation: operation as 'nop' | 'acc' | 'jmp',
        argument
      };
    });
  }

  constructor(instructions: Instruction[], logOutput: boolean = false) {
    this.instructions = instructions;
    this.logOutput = logOutput;
    this.acc = 0;
    this.iPtr = 0;
    this.instructionSet = new Set();
  }

  run(): ExitCode {
    // tslint:disable-next-line:no-empty
    do {
      const stepCode = this.step();
      if (stepCode >= 0) {
        return stepCode;
      }
    } while (true);
  }

  get accumulator() {
    return this.acc;
  }

  private log(...args: any[]) {
    if (this.logOutput) {
      console.log(...args);
    }
  }

  private step(): ExitCode {
    if (this.instructionSet.has(this.iPtr)) {
      console.log(`Infinite loop - have already run instruction @${this.iPtr}`);
      return ExitCode.INFINITE_LOOP;
    }

    if (this.iPtr === this.instructions.length) {
      console.log(`Program finished normally after last instruction @${this.iPtr}`);
      return ExitCode.OK;
    }

    if (this.iPtr > this.instructions.length) {
      console.log(`Attempted to run instruction out of bounds @${this.iPtr}`);
      return ExitCode.INSTRUCTION_OUT_OF_BOUNDS;
    }

    this.instructionSet.add(this.iPtr);
    const instruction = this.instructions[this.iPtr];

    this.log(`Running instruction @${this.iPtr}`, instruction);

    switch (instruction.operation) {
      case 'acc': {
        this.acc += instruction.argument;
        this.iPtr += 1;
        break;
      }
      case 'jmp': {
        this.iPtr += instruction.argument;
        break;
      }
      case 'nop': {
        this.iPtr += 1;
        break;
      }
      default: {
        console.error(`Invalid instruction @${this.iPtr}`, instruction);
        throw new Error(`Invalid instruction @${this.iPtr}`);
      }
    }

    return ExitCode.CONTINUE;
  }
}