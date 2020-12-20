import { readLines } from '../lib';

const input = readLines('src/day18/input.txt');
// console.log('input', input);

const findNextStartIndex = (symbols: (string | number)[]): number => {
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
          return i + 1;
        }
      }
    }
  }

  return 0;
}

const evaluateLine = (line: string): number => {
  const symbols = line.split('').filter(s => !!s.trim()).map(s => {
    const val = parseInt(s, 10);
    return isNaN(val) ? s : val;
  });
  // console.log('symbols', symbols);

  while (symbols.length > 1) {
    const startIndex = findNextStartIndex(symbols);
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

let sum = 0;
for (const line of input) {
  sum += evaluateLine(line);
}

console.log(`Part 1: ${sum}`);