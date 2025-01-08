import { Episode } from '@/constants/types';
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
  setEpisodeIds: (current, prev, next) => set({ currentEpisodeId: current, prevEpisodeId: prev, nextEpisodeId: next }),
}));

interface WatchEpisodeMetaData {
  episodeId: string;
  episodeDubId?: string;
  isDub?: string;
  poster?: string;
  title: string;
  description?: string;
}

interface EpisodesState {
  episodes: Episode[];
  setEpisodes: (episodes: Episode[]) => void;
}

export const useEpisodesStore = create<EpisodesState>((set) => ({
  episodes: [],
  setEpisodes: (episodes: Episode[]) => set({ episodes }),
}));
