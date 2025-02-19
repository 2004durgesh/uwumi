import { Episode, EpisodeDisplayMode, IMovieSeason } from '@/constants/types';
import { create } from 'zustand';

interface EpisodesIdState {
  currentEpisodeId: string | null;
  prevEpisodeId: string | null;
  nextEpisodeId: string | null;
  setEpisodeIds: (current: string | null, prev?: string | null, next?: string | null) => void;
}

export const useEpisodesIdStore = create<EpisodesIdState>((set) => ({
  currentEpisodeId: null,
  prevEpisodeId: null,
  nextEpisodeId: null,
  setEpisodeIds: (current, prev, next) => {
    set({ currentEpisodeId: current, prevEpisodeId: prev, nextEpisodeId: next });
  },
}));

interface EpisodesState {
  episodes: Episode[];
  setEpisodes: (episodes: Episode[]) => void;
}

export const useEpisodesStore = create<EpisodesState>((set) => ({
  episodes: [],
  setEpisodes: (episodes: Episode[]) => set({ episodes }),
}));


interface EpisodeDisplayState {
  displayMode: EpisodeDisplayMode;
  setDisplayMode: (mode: EpisodeDisplayMode) => void;
}

export const useEpisodeDisplayStore = create<EpisodeDisplayState>((set) => ({
  displayMode: EpisodeDisplayMode.FullMetadata,
  setDisplayMode: (mode) => set({ displayMode: mode }),
}));
