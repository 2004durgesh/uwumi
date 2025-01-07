import { create } from 'zustand';

interface CurrentPlayingEpisodeStore {
    currentPlayingEpisode: string | null;
    setCurrentPlayingEpisode: (episodeId: string) => void;
}

export const useCurrentPlayingEpisode = create<CurrentPlayingEpisodeStore>((set) => ({
    currentPlayingEpisode: null,
    setCurrentPlayingEpisode: (episodeId: string) => set({ currentPlayingEpisode: episodeId }),
}));