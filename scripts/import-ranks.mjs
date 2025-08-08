#!/usr/bin/env node
import fs from 'node:fs/promises';

async function main() {
  const inFile = new URL('../data/custom-ranks.json', import.meta.url);
  try {
    const raw = await fs.readFile(inFile, 'utf8');
    const parsed = JSON.parse(raw);
    console.log('Loaded custom ranks, count:', parsed.length);
  } catch (e) {
    console.error('No custom ranks found. Run `npm run export:ranks` first.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});