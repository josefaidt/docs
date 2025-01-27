import * as fs from 'node:fs/promises';
import config from './cspell.json';

const result = { ...config };
const words = config.words;

result.words = Array.from(new Set(words)).sort();

for (const dictionary of result.dictionaryDefinitions) {
  const words = new Set(dictionary.words);
  dictionary.words = Array.from(words).sort();
}

for (const override of result.overrides) {
  const words = new Set(override.words);
  override.words = Array.from(words).sort();
}

await fs.writeFile('./cspell.json', JSON.stringify(result, null, 2));
