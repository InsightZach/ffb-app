import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import seedPlayers from '../../data/players.json';

type Player = {
  id: string;
  name: string;
  // Some seeds include like "WR1"; normalize for display
  pos: string;
  team?: string;
};

type RankingsState = {
  rankings: Player[];
  setRankings: (players: Player[]) => void;
  ensureSeed: () => Promise<void>;
};

const STORAGE_KEY = 'ffb_rankings_v1';

export const useRankingsStore = create<RankingsState>((set, get) => ({
  rankings: [],
  setRankings: (players) => {
    set({ rankings: players });
    // Persist
    SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(players)).catch(() => {
      // ignore
    });
  },
  ensureSeed: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Player[];
        set({ rankings: parsed });
        return;
      }
    } catch {}

    // Seed from data/players.json (Top-250+)
    const normalized: Player[] = (seedPlayers as any[]).map((p) => ({
      id: p.id,
      name: p.name.replace(/\s+[A-Z]{2,3}$/,'').trim(),
      pos: String(p.pos).replace(/\d+$/,'').toUpperCase(),
      team: (p.name.match(/([A-Z]{2,3})$/)?.[1] ?? p.team) || undefined,
    }));
    set({ rankings: normalized.slice(0, 250) });
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(normalized.slice(0, 250)));
    } catch {}
  },
}));

