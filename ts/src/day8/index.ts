import { readLines } from '../lib';
import { Computer, ExitCode } from '../lib/computer';

const input = readLines('src/day8/input.txt');
// console.log('input', input);

const instructions = Computer.parseInstructions(input);
const part1Computer = new Computer(instructions);
part1Computer.run();
console.log(`Part 1: ${part1Computer.accumulator}`);

for (let i = 0; i < instructions.length; i++) {
  const toChange = instructions[i];
  if (toChange.operation === 'nop' || toChange.operation === 'jmp') {
    console.log(`Attempting change of instruction @${i}`);

    const changedInstructions = JSON.parse(JSON.stringify(instructions));
    changedInstructions[i].operation = toChange.operation === 'nop' ? 'jmp' : 'nop';

    const part2Computer = new Computer(changedInstructions);
    const exitCode = part2Computer.run();
    if (exitCode === ExitCode.OK) {
      console.log(`Part 2: ${part2Computer.accumulator}`);
      break;
    }
  }
}