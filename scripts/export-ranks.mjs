#!/usr/bin/env node
import fs from 'node:fs/promises';

async function main() {
  const storeFile = new URL('../data/custom-ranks.json', import.meta.url);
  const example = [
    { id: 'p_bijan_robinson' },
    { id: 'p_saquon_barkley' },
  ];
  await fs.mkdir(new URL('../data/', import.meta.url), { recursive: true });
  await fs.writeFile(storeFile, JSON.stringify(example, null, 2));
  console.log('Exported example custom ranks to data/custom-ranks.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});