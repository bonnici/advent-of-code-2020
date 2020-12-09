
import { readLines } from '../lib';

const input = readLines('src/day7/input.txt');

const bagCountRegex = /(?<amount>\d+) (?<colour>[\w ]+)/;

interface BagAmount {
  amount: number;
  colour: string;
}

const canBeContainedIn: {[colour: string]: Set<string>} = {};
const contains: {[colour: string]: BagAmount[]} = {};

for (const line of input) {
  // pale magenta bags contain 2 striped coral bags, 1 shiny orange bag, 3 vibrant white bags, 4 posh cyan bags.
  const split = line.split(/ contain |, |\.| bags?|no other/).filter(s => !!s);

  const sourceBag = split[0];
  const contained = split.slice(1).map(text => {
    const matches = text.match(bagCountRegex);
    const amount = parseInt(matches?.groups?.amount || '0', 10);
    const colour = matches?.groups?.colour || '';
    return { amount, colour };
  });
  // console.log('result', { sourceBag, contained });

  contains[sourceBag] = contained;

  contained.forEach(({ colour }) => {
    if (!(colour in canBeContainedIn)) {
      canBeContainedIn[colour] = new Set();
    }
    canBeContainedIn[colour].add(sourceBag);
  });
}

// console.log('canBeContainedIn', canBeContainedIn);

const shinyGoldCanBeContainedId = new Set<string>();
const unvisited = canBeContainedIn['shiny gold']
  ? [...canBeContainedIn['shiny gold'].values()]
  : [];
const visited = new Set();
visited.add('shiny gold');

while (unvisited.length > 0) {
  const curUnvisited = unvisited.pop();
  if (!curUnvisited) {
    continue;
  }

  shinyGoldCanBeContainedId.add(curUnvisited);
  if (!visited.has(curUnvisited) && curUnvisited in canBeContainedIn) {
    unvisited.push(...canBeContainedIn[curUnvisited].values());
  }
}

// console.log('shinyGoldCanBeContainedId', shinyGoldCanBeContainedId);

console.log(`Part 1: ${shinyGoldCanBeContainedId.size}`);

// console.log('contains', contains);

const totalBags = (colour: string) => {
  if (!contains[colour]) {
    return 0;
  }

  let total = 0;
  for (const bagAmount of contains[colour]) {
    const amount = bagAmount.amount;
    total += amount + amount * (totalBags(bagAmount.colour));
  }

  return total;
};

console.log(`Part 2: ${totalBags('shiny gold')}`);