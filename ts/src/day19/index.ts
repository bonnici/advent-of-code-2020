import { readLinesInGroups } from '../lib';

const input = readLinesInGroups('src/day19/input.txt');
// console.log('input', input);

const rules: { [index: number]: Rule } = {};

class Option {
  letter?: string;
  ruleIds?: number[];

  constructor(str: string) {
    if (str.trim() === '"a"') {
      this.letter = 'a';
    } else if (str.trim() === '"b"') {
      this.letter = 'b';
    } else {
      const ruleIds = str.trim().split(' ').map(n => parseInt(n, 10));
      if (ruleIds.length < 1 || ruleIds.length > 3) {
        throw new Error(`Invalid option: ${str}`);
      }
      ruleIds.forEach(id => {
        if (isNaN(id)) {
          throw new Error(`Invalid option: ${str}`);
        }
      })
      this.ruleIds = ruleIds;
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
class Rule {
  public index: number;
  options: Option[];

  constructor(line: string) {
    const split = line.split(':');

    if (split.length !== 2) {
      throw new Error(`Invalid line: ${line}`);
    }

    this.index = parseInt(split[0], 10);

    if (isNaN(this.index)) {
      throw new Error(`Invalid line: ${line}`);
    }

    const options = split[1].split('|');

    if (options.length === 1) {
      this.options = [new Option(options[0])];
    } else if (options.length === 2) {
      this.options = [new Option(options[0]), new Option(options[1])];
    } else {
      throw new Error(`Invalid line: ${line}`);
    }
  }
}

for (const line of input[0]) {
  const rule = new Rule(line);
  rules[rule.index] = rule;
}

// console.log('rules', rules);

