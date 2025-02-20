import { create } from 'zustand';
import { storage } from '@/hooks/stores/MMKV';
import { MediaType } from '@/constants/types';

interface Provider {
  name: string;
  value: string;
  subbed?: boolean;
  dubbed?: boolean;
}

interface ProviderGroups {
  [MediaType.ANIME]: Provider[];
  [MediaType.MANGA]: Provider[];
  [MediaType.MOVIE]: Provider[];
}

// Define all providers in one place
const PROVIDERS: ProviderGroups = {
  [MediaType.ANIME]: [
    // { name: 'Gogoanime', value: 'gogo', sub: true, dub: true },
    { name: 'Zoro', value: 'zoro', subbed: true, dubbed: true },
    { name: 'AnimeKai', value: 'animekai', subbed: true, dubbed: true },
    // { name: 'AnimePahe', value: 'animepahe', sub: true, dub: true },
  ],
  [MediaType.MANGA]: [
    { name: 'Mangadex', value: 'mangadex' },
    { name: 'Mangakakalot', value: 'mangakakalot' },
  ],
  [MediaType.MOVIE]: [
    { name: 'Rive', value: 'rive' },
    { name: 'MultiMovies', value: 'multimovies' },
    { name: 'FlixHQ', value: 'flixhq' },
    { name: 'SFlix', value: 'sflix' },
    { name: 'DramaCool', value: 'dramacool' },
  ],
};

// Default providers for each media type
const DEFAULT_PROVIDERS = {
  [MediaType.ANIME]: 'zoro',
  [MediaType.MANGA]: 'mangadex',
  [MediaType.MOVIE]: 'rive',
};

// Meta providers (if needed)
const META_PROVIDERS = {
  [MediaType.ANIME]: 'anilist',
  [MediaType.MANGA]: 'anilist-manga',
  [MediaType.MOVIE]: 'tmdb',
};

interface ProviderState {
  providers: {
    [key in MediaType]: string;
  };
  setProvider: (mediaType: MediaType, provider: string) => void;
  getProvider: (mediaType: MediaType) => string;
  getAvailableProviders: (mediaType: MediaType) => Provider[];
  getDefaultProvider: (mediaType: MediaType) => string;
  getMetaProvider: (mediaType: MediaType) => string;
}

const STORAGE_KEY = 'mediaProviders';

const getInitialProviders = () => {
  const stored = storage.getString(STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_PROVIDERS;
};

export const useProviderStore = create<ProviderState>((set, get) => ({
  providers: getInitialProviders(),

  setProvider: (mediaType, provider) => {
    set((state) => {
      const newProviders = {
        ...state.providers,
        [mediaType]: provider,
      };
      storage.set(STORAGE_KEY, JSON.stringify(newProviders));
      return { providers: newProviders };
    });
  },

  getProvider: (mediaType) => {
    return get().providers[mediaType];
  },

  getAvailableProviders: (mediaType) => {
    return PROVIDERS[mediaType] || [];
  },

  getDefaultProvider: (mediaType) => {
    return DEFAULT_PROVIDERS[mediaType];
  },

  getMetaProvider: (mediaType) => {
    return META_PROVIDERS[mediaType];
  },
}));

// Export providers for direct access if needed
export { PROVIDERS, DEFAULT_PROVIDERS, META_PROVIDERS };
