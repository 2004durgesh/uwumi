import { IMovieEpisode } from 'react-native-consumet';

export interface Episode {
  id: string;
  dubId?: string;
  uniqueId: string;
  isDubbed?: boolean;
  isSubbed?: boolean;
  isFiller?: boolean;
  number: number;
  url: string;
  dubUrl?: string;
  image?: string;
  title: string;
  description?: string;
  createdAt?: string;
  [x: string]: any;
}

export enum MediaType {
  ANIME = 'anime',
  MANGA = 'manga',
  MOVIE = 'movie',
}

export type MediaFeedType = 'trending' | 'popular' | 'search';
export type MetaProvider = 'anilist' | 'anilist-manga' | 'tmdb';

export interface Character {
  id: number;
  image?: string;
  name: {
    native?: string;
    userPreferred?: string;
  };
  role?: string;
  voiceActors: {
    id?: number;
    language?: string;
    name: {
      first?: string;
      full?: string;
      last?: string;
      native?: string;
    };
    image?: string;
  };
}

export interface Details {
  characters?: Character[];
  studios: string[];
  subOrDub: 'sub' | 'dub';
  trailer: {
    id: string;
    site?: string;
    thumbnail?: string;
  };
  countryOfOrigin?: string;
  description: string;
  duration: number;
  endDate?: {
    year: number;
    month: number;
    day: number;
  };
  startDate?: {
    year: number;
    month: number;
    day: number;
  };
}

export interface IMovieSeason {
  season: number;
  image?: {
    mobile?: string;
    hd?: string;
  };
  episodes: IMovieEpisode[];
}

export enum EpisodeDisplayMode {
  FullMetadata = 'full',
  TitleOnly = 'title',
  NumberOnly = 'number',
}
