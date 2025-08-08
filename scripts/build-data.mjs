#!/usr/bin/env node
import fs from 'node:fs/promises';

async function main() {
  const outDir = new URL('../data/', import.meta.url);
  await fs.mkdir(outDir, { recursive: true });
  // Placeholder: write empty players.json and meta.json
  const players = [];
  const meta = { updatedAt: new Date().toISOString(), sources: [] };
  await fs.writeFile(new URL('players.json', outDir), JSON.stringify(players, null, 2));
  await fs.writeFile(new URL('meta.json', outDir), JSON.stringify(meta, null, 2));
  console.log('Wrote data/players.json and data/meta.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});