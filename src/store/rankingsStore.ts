import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type Player = {
  id: string;
  name: string;
  pos: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';
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

    // Minimal seed of sample players now; we'll replace with real 2025 Top-250 soon.
    const seed: Player[] = [
      { id: 'p_bijan_robinson', name: 'Bijan Robinson', pos: 'RB', team: 'ATL' },
      { id: 'p_saquon_barkley', name: 'Saquon Barkley', pos: 'RB', team: 'PHI' },
      { id: 'p_jamarr_chase', name: "Ja'Marr Chase", pos: 'WR', team: 'CIN' },
      { id: 'p_justin_jefferson', name: 'Justin Jefferson', pos: 'WR', team: 'MIN' },
      { id: 'p_jahmyr_gibbs', name: 'Jahmyr Gibbs', pos: 'RB', team: 'DET' },
    ];
    set({ rankings: seed });
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(seed));
    } catch {}
  },
}));

