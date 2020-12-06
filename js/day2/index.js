const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(line => line.trim());

const captureRe = /^(\d+)-(\d+) (\w): (\w+)$/;

const matchPt1 = (min, max, ch, text) => {
  const charCount = text.split('').filter(c => c === ch).length;
  return charCount >= min && charCount <= max;
}

const matchPt2 = (pos1, pos2, ch, text) => {
  const pos1Match = text[pos1 - 1] === ch;
  const pos2Match = text[pos2 - 1] === ch;

  return (pos1Match || pos2Match) && !(pos1Match && pos2Match);
}

let countPt1 = 0;
let countPt2 = 0;

for (const line of input) {
  console.log(`Line: ${line}`);

  const match = captureRe.exec(line);
  let num1 = parseInt(match[1]);
  let num2 = parseInt(match[2]);
  let ch = match[3];
  let text = match[4];

  console.log(`num1: ${num1}, num2: ${num2}, ch: ${ch}, text: ${text}`);
  
  if (matchPt1(num1, num2, ch, text)) {
    console.log('Passes part 1 check');
    countPt1++;
  }

  if (matchPt2(num1, num2, ch, text)) {
    console.log('Passes part 2 check');
    countPt2++;
  }
}

console.log(`Part 1 count: ${countPt1}, part 2 count: ${countPt2}`);