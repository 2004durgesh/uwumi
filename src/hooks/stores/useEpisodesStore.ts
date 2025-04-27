import { EpisodeDisplayMode } from '@/constants/types';
import { create } from 'zustand';
import { IAnimeEpisode, IMovieEpisode } from 'react-native-consumet';

interface EpisodesIdState {
  currentUniqueId: string | null;
  currentEpisodeId: string | null;
  prevUniqueId: string | null;
  nextUniqueId: string | null;
  setEpisodeIds: (
    currenteid: string | null,
    currentuid: string | null,
    prevuid?: string | null,
    nextuid?: string | null,
  ) => void;
}

export const useEpisodesIdStore = create<EpisodesIdState>((set) => ({
  currentUniqueId: null,
  currentEpisodeId: null,
  prevUniqueId: null,
  nextUniqueId: null,
  setEpisodeIds: (currenteid, currentuid, prevuid, nextuid) => {
    set({ currentEpisodeId: currenteid, currentUniqueId: currentuid, prevUniqueId: prevuid, nextUniqueId: nextuid });
  },
}));

interface EpisodesState {
  episodes: IAnimeEpisode[] | IMovieEpisode[];
  setEpisodes: (episodes: IAnimeEpisode[] | IMovieEpisode[]) => void;
}

export const useEpisodesStore = create<EpisodesState>((set) => ({
  episodes: [],
  setEpisodes: (episodes: IAnimeEpisode[] | IMovieEpisode[]) => set({ episodes }),
}));

interface EpisodeDisplayState {
  displayMode: EpisodeDisplayMode;
  setDisplayMode: (mode: EpisodeDisplayMode) => void;
}

export const useEpisodeDisplayStore = create<EpisodeDisplayState>((set) => ({
  displayMode: EpisodeDisplayMode.FullMetadata,
  setDisplayMode: (mode) => set({ displayMode: mode }),
}));

interface SeasonState {
  seasonNumber: number;
  setSeasonNumber: (seasonNumber: number) => void;
  resetSeasonNumber: () => void;
}

export const useSeasonStore = create<SeasonState>((set) => ({
  seasonNumber: 0,
  setSeasonNumber: (seasonNumber) => set({ seasonNumber }),
  resetSeasonNumber: () => set({ seasonNumber: 0 }),
}));
