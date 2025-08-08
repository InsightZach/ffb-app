#!/usr/bin/env node
import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';

const SOURCES = {
  fantasyProsADP: 'https://www.fantasypros.com/nfl/adp/ppr-overall.php',
  pfrScrimmage2024: 'https://www.pro-football-reference.com/years/2024/scrimmage.htm',
};

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'ffb-app/1.0' } });
  if (!res.ok) throw new Error(`Failed fetch ${url}: ${res.status}`);
  return await res.text();
}

function normalizeName(name) {
  return name.trim().replace(/\s+/g, ' ');
}

async function loadFantasyProsADP() {
  const html = await fetchText(SOURCES.fantasyProsADP);
  const $ = cheerio.load(html);
  const players = [];
  $('table').each((_, tbl) => {
    const headers = $(tbl)
      .find('thead th')
      .map((__, th) => $(th).text().trim().toLowerCase())
      .get();
    if (!(headers.includes('rank') && headers.some((h) => h.includes('player')))) return;
    $(tbl)
      .find('tbody tr')
      .each((__, tr) => {
        const tds = $(tr).find('td');
        if (!tds.length) return;
        const get = (name) => {
          const idx = headers.findIndex((h) => h.includes(name));
          if (idx === -1) return '';
          return $(tds[idx]).text().trim();
        };
        const rank = Number(get('rank'));
        const nameCell = get('player') || get('name');
        const posCell = get('pos') || get('position');
        if (!rank || !nameCell) return;
        const name = normalizeName(nameCell.replace(/\s+\(.*/, ''));
        const pos = (posCell || '').toUpperCase();
        players.push({
          id: `fp_${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name,
          pos,
          team: undefined,
          adp: { fantasypros: rank },
        });
      });
  });
  return players.slice(0, 300);
}

async function loadPfrScrimmage2024() {
  const html = await fetchText(SOURCES.pfrScrimmage2024);
  const $ = cheerio.load(html);
  const stats = new Map();
  $('#scrimmage tr').each((_, tr) => {
    const tds = $(tr).find('td');
    if (!tds.length) return;
    const name = normalizeName($(tr).find('th[data-stat="player"] a').text());
    if (!name) return;
    const team = $(tds.filter('[data-stat="team"]')).text().trim();
    const yds = Number($(tds.filter('[data-stat="yds_from_scrimmage"]')).text().replace(/,/g, '')) || 0;
    const td = Number($(tds.filter('[data-stat="total_td"]')).text()) || 0;
    stats.set(name.toLowerCase(), { team, yfs: yds, td });
  });
  return stats;
}

async function main() {
  const [adp, pfr] = await Promise.all([
    loadFantasyProsADP(),
    loadPfrScrimmage2024(),
  ]);

  // Merge rough PFR stats into ADP list by name
  const merged = adp.map((p) => {
    const s = pfr.get(p.name.toLowerCase());
    return {
      ...p,
      team: p.team || s?.team,
      stats2024: s ? { scrimmageYds: s.yfs, totalTD: s.td } : undefined,
    };
  });

  const outDir = new URL('../data/', import.meta.url);
  await fs.mkdir(outDir, { recursive: true });
  const meta = { updatedAt: new Date().toISOString(), sources: Object.values(SOURCES) };
  await fs.writeFile(new URL('players.json', outDir), JSON.stringify(merged, null, 2));
  await fs.writeFile(new URL('meta.json', outDir), JSON.stringify(meta, null, 2));
  console.log(`Wrote ${merged.length} players to data/players.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});