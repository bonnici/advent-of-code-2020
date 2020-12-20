import { readLines } from '../lib';

const input = readLines('src/day18/input.txt');
// console.log('input', input);

const applyPrecedence = (symbols: (string | number)[], startIndex: number): number => {
  // find first addition until the next brackets
  for (let i = startIndex + 1; i < symbols.length - 1; i++) {
    const curSymbol = symbols[i];
    if (curSymbol === ')') {
      break;
    }

    if (curSymbol === '+') {
      // console.log(`Applying precedence and returning index ${i - 1}`);
      return i - 1;
    }
  }

  // if no additions, fall back to normal start index
  return startIndex;
}

const findNextStartIndex = (symbols: (string | number)[], part2: boolean): number => {
  if (symbols.length <= 1) {
    throw new Error("Shouldn't get here");
  }

  // first try to find a '(' followed by a ')' 2 chars away
  for (let i = 0; i < symbols.length - 2; i++) {
    const curSymbol = symbols[i];
    if (curSymbol === '(' && symbols[i + 2] === ')') {
      return i;
    }
  }

  // then try to find a '(' followed by a ')' before any other '('
  for (let i = 0; i < symbols.length - 2; i++) {
    const curSymbol = symbols[i];
    if (curSymbol === '(') {
      for (let j = i + 1; j < symbols.length; j++) {
        const otherSymbol = symbols[j];
        if (otherSymbol === '(') {
          break;
        } else if (otherSymbol === ')') {
          return part2 ? applyPrecedence(symbols, i + 1) : i + 1;
        }
      }
    }
  }

  return part2 ? applyPrecedence(symbols, 0) : 0;
}

const evaluateLine = (line: string, part2: boolean): number => {
  const symbols = line.split('').filter(s => !!s.trim()).map(s => {
    const val = parseInt(s, 10);
    return isNaN(val) ? s : val;
  });
  // console.log('symbols', symbols);

  while (symbols.length > 1) {
    const startIndex = findNextStartIndex(symbols, part2);
    const symbol = symbols[startIndex];
    // console.log(`Processing ${symbol} at ${startIndex}`);

    if (typeof(symbol) === 'number') {
      const operation = symbols[startIndex + 1];
      const secondNum = symbols[startIndex + 2];

      if (typeof(secondNum) !== 'number' || (operation !== '+' && operation !== '*')) {
        throw new Error(`Unexpected symbols ${symbol}, ${operation}, ${secondNum} starting at ${startIndex}`);
      }

      const result = operation === '+'
        ? (symbol as number) + (secondNum as number)
        : (symbol as number) * (secondNum as number);

      // console.log(`${symbol} ${operation} ${secondNum} = ${result}`);
      symbols.splice(startIndex, 3, result);
    } else if (symbol === '(') {
      const num = symbols[startIndex + 1];
      const closingBracket = symbols[startIndex + 2];

      if (typeof(num) !== 'number' || closingBracket !== ')') {
        throw new Error(`Unexpected brackets ${symbol}, ${num}, ${closingBracket} starting at ${startIndex}`);
      }

      // console.log('Removing brackets');
      symbols.splice(startIndex, 3, num);
    } else {
      throw new Error(`Unexpected symbol ${symbol} at ${startIndex}`);
    }
  }

  return symbols[0] as number;
}

let sumPart1 = 0;
let sumPart2 = 0;
for (const line of input) {
  sumPart1 += evaluateLine(line, false);
  sumPart2 += evaluateLine(line, true);
}

console.log(`Part 1: ${sumPart1}`);
console.log(`Part 2: ${sumPart2}`);