import * as fs from 'node:fs/promises';

const output = await fs.readFile('./cout.txt', 'utf8');
const result: string[] = [];

for (const line of output.split('\n')) {
  const [, , , , word] = line.split(' ');
  if (word?.startsWith('(') && word?.endsWith(')')) {
    const w = word.slice(1, -1);
    if (!result.includes(w)) {
      result.push(w);
    }
  }
}

console.log(result.sort().join('\n'));
const json = JSON.stringify(result.sort(), null, 2);
await fs.writeFile('./words.json', json);
