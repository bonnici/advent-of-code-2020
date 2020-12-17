import { readLinesInGroups } from '../lib';

const input = readLinesInGroups('src/day16/input.txt');
// console.log('input', input);

const ruleRegex = /(?<name>[\w\s]+): (?<min1>\d+)-(?<max1>\d+) or (?<min2>\d+)-(?<max2>\d+)/;

class Rule {
  readonly name: string;
  readonly min1: number;
  readonly max1: number;
  readonly min2: number;
  readonly max2: number;

  constructor(line: string) {
    const matches = line.match(ruleRegex);
    this.name = matches?.groups?.name || '';
    this.min1 = parseInt(matches?.groups?.min1 || '-1', 10);
    this.max1 = parseInt(matches?.groups?.max1 || '-1', 10);
    this.min2 = parseInt(matches?.groups?.min2 || '-1', 10);
    this.max2 = parseInt(matches?.groups?.max2 || '-1', 10);

    if (!this.name || this.min1 < 0 || this.max1 < 0 || this.min2 < 0 || this.max2 < 0) {
      throw new Error(`Unexpected rule: ${line}`);
    }
  }

  isValidField(field: number) {
    return (field >= this.min1 && field <= this.max1) || (field >= this.min2 && field <= this.max2);
  }
}

// tslint:disable-next-line:max-classes-per-file
class Ticket {
  readonly fields: number[];

  constructor(line: string) {
    this.fields = line.split(',').map(n => parseInt(n, 10));
  }

  errorRate(rulesToCheck: Rule[]) {
    let errorRate = 0;
    for (const field of this.fields) {
      if (rulesToCheck.every(rule => !rule.isValidField(field))) {
        errorRate += field;
      }
    }
    return errorRate;
  }
}

const rules = input[0].map(line => new Rule(line));
// console.log('rules', rules);

const myTicket = new Ticket(input[1][1]);
// console.log('myTicket', myTicket);

const otherTickets = input[2].slice(1).map(line => new Ticket(line));
// console.log('otherTickets', otherTickets);

const validTickets = [];

let totalErrorRate = 0;
for (const ticket of otherTickets) {
  const errorRate = ticket.errorRate(rules);
  if (errorRate === 0) {
    validTickets.push(ticket);
  } else {
    totalErrorRate += errorRate;
  }
}

console.log(`Part 1: ${totalErrorRate}`);

// console.log(`validTickets: ${validTickets.length} out of ${otherTickets.length}`);

const possibleFieldIndices = myTicket.fields.map(_ => {
  const possibleIndices: Set<number> = new Set();
  for (let i = 0; i < rules.length; i++) {
    possibleIndices.add(i);
  }
  return possibleIndices;
});

// console.log(`possibleFieldIndices start`, possibleFieldIndices);

for (const ticket of validTickets) {
  for (let fieldIdx = 0; fieldIdx < ticket.fields.length; fieldIdx++) {
    const field = ticket.fields[fieldIdx];
    for (let ruleIdx = 0; ruleIdx < rules.length; ruleIdx++) {
      const rule = rules[ruleIdx];
      if (!rule.isValidField(field)) {
        possibleFieldIndices[fieldIdx].delete(ruleIdx);
      }
    }
  }
}

console.log(`possibleFieldIndices first pass`, possibleFieldIndices);

let allSetsHaveSingleOption = false;
while (!allSetsHaveSingleOption) {
  const singleOptionSets = possibleFieldIndices.filter(set => set.size === 1);
  const multiOptionSets = possibleFieldIndices.filter(set => set.size > 1);

  multiOptionSets.forEach(multiOptionSet => {
    singleOptionSets.forEach(singleOptionSet => {
      const singleOption = singleOptionSet.values().next().value;
      multiOptionSet.delete(singleOption);
    });
  });

  allSetsHaveSingleOption = singleOptionSets.length === possibleFieldIndices.length;
}

console.log(`possibleFieldIndices second pass`, possibleFieldIndices);

let result = 1;
for (let fieldIdx = 0; fieldIdx < myTicket.fields.length; fieldIdx++) {
  const myTicketField = myTicket.fields[fieldIdx];
  const ruleIdx = possibleFieldIndices[fieldIdx].values().next().value;
  const rule = rules[ruleIdx];

  console.log(`Field ${fieldIdx} with value ${myTicketField} uses rule ${ruleIdx} (${rule.name})`);

  if (rule.name.startsWith('departure ')) {
    result *= myTicketField;
  }
}

console.log(`Part 2: ${result}`);