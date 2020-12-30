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
      // if (ruleIds.length < 1 || ruleIds.length > 3) {
      //   throw new Error(`Invalid option: ${str}`);
      // }
      ruleIds.forEach(id => {
        if (isNaN(id)) {
          throw new Error(`Invalid option: ${str}`);
        }
      })
      this.ruleIds = ruleIds;
    }
  }

  public toRegexStr(): string {
    if (this.letter) {
      return this.letter;
    } else if (this.ruleIds) {
      return this.ruleIds.map(id => {
        const rule = rules[id];
        if (!rule) {
          throw new Error(`Invalid rule ${id} in option`);
        }
        return rule.toRegexStr();
      }).join('');
    } else {
      throw new Error(`Invalid option`);
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
class Rule {
  public index: number;
  public options: Option[];

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

    /*
    if (options.length === 1) {
      this.options = [new Option(options[0])];
    } else if (options.length === 2) {
      this.options = [new Option(options[0]), new Option(options[1])];
    } else {
      throw new Error(`Invalid line: ${line}`);
    }
    */
    this.options = options.map(o => new Option(o));
  }

  public toRegexStr(): string {
    if (this.options.length === 1) {
      return this.options[0].toRegexStr();
    } else {
      return `(?:${this.options.map(o => o.toRegexStr()).join('|')})`;
    }
  }
}

for (const line of input[0]) {
  const rule = new Rule(line);
  rules[rule.index] = rule;
}

// console.log('rules', rules);

const rule0RegexStr = `^${rules[0].toRegexStr()}$`;
// console.log('rule 0 regex', rule0RegexStr);
// console.log('rule 1 regex', `^${rules[1].toRegexStr()}$`);
// console.log('rule 2 regex', `^${rules[2].toRegexStr()}$`);
// console.log('rule 4 regex', `^${rules[4].toRegexStr()}$`);

const rule0Regex = new RegExp(rule0RegexStr);

let matches = 0;
for (const line of input[1]) {
  if (line.match(rule0Regex)) {
    matches++;
  }
}

console.log(`Part 1: ${matches}`);

const rule0RegexesPt2 = [];
for (let i = 0; i < 10; i++) {
  console.log(`Generating regexes iteration ${i + 1}`);

  let rule8Line = '8: 42';
  for (let x = 0; x < i; x++) {
    rule8Line = `${rule8Line} |${' 42'.repeat(x + 2)}`;
  }
  rules[8] = new Rule(rule8Line);

  for (let j = 0; j < 10; j++) {
    let rule11Line = '11: 42 31';
    for (let x = 0; x < j; x++) {
      rule11Line = `${rule11Line} |${' 42'.repeat(x + 2)}${' 31'.repeat(x + 2)}`;
    }
    rules[11] = new Rule(rule11Line);

    const regexStr = `^${rules[0].toRegexStr()}$`;
    rule0RegexesPt2.push(new RegExp(regexStr))
  }
}

let matchesPt2 = 0;
for (const line of input[1]) {
  if (rule0RegexesPt2.some(regex => line.match(regex))) {
    matchesPt2++;
  }
}

console.log(`Part 2: ${matchesPt2}`);