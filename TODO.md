# Project TODO (Owners: Subagents)

- [ ] Seed Top-250 + ADPs (Owner: Agent-Data)
  - Pull 2025 ADP from FantasyPros + Underdog + CBS
  - Normalize players (id, name, pos, team, adpBySite)
  - Output `data/players.json` and `data/meta.json` (timestamp, sources)
  - Acceptance: `npm run build:data` generates files with >230 players

- [ ] 2024 Stats integration (Owner: Agent-Data)
  - Scrape/export PFR pages (passing/rushing/receiving/scrimmage)
  - Join to players by name + team mapping
  - Store per-player `stats2024` in `data/players.json`
  - Acceptance: 90%+ of Top-250 have stats merged

- [ ] UI: search and filters (Owner: Agent-UI)
  - Search by name
  - Filters: Positions (QB/RB/WR/TE), Teams
  - Acceptance: User can filter + search and list updates live

- [ ] UI: drag handle + save indicator (Owner: Agent-UI)
  - Visible drag grip; show “Saved” after re-order persist
  - Acceptance: Save indicator appears/disappears correctly

- [ ] Player detail drawer (Owner: Agent-Detail)
  - Show 2024 stats, 2025 ADPs per site
  - Placeholder for projections
  - Acceptance: Tap row opens bottom sheet with data

- [ ] Import/Export (Owner: Agent-Persist)
  - Export custom ranks to JSON/CSV
  - Import JSON to restore ordering
  - Acceptance: Round-trip preserves order count

- [ ] Nightly data refresh (Owner: Agent-Deploy)
  - GitHub Action (cron) runs data build and opens PR
  - Acceptance: PR opened on success, includes updated `data/` files

- [ ] README updates (Owner: Agent-Docs)
  - Document data sources and update cadence
  - Link live app and contribution steps

## Notes
- Sources:
  - FantasyPros ADP, Underdog ADP, CBS ADP, PFR 2024 stats
- Tech tasks adders:
  - Add scripts under `scripts/` and `data/` folders
  - New npm scripts: `build:data`, `import:ranks`, `export:ranks`