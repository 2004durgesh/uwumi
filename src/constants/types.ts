export interface EpisodeTitle {
  "x-jat"?: string;
  en?: string;
  ja?: string;
  [key: string]: string | undefined;
}

// Image export Interface
export interface SeriesImage {
  coverType: string;
  url: string;
}

// Mappings export Interface
export interface Mappings {
  animeplanet_id: string;
  kitsu_id: number;
  mal_id: number;
  type: string;
  anilist_id: number;
  anisearch_id: number;
  anidb_id: number;
  notifymoe_id: string;
  livechart_id: number;
  thetvdb_id: number;
  imdb_id: string;
  themoviedb_id: string;
}

// Episode export Interface
export interface Episode {
  title: EpisodeTitle;
  tvdbShowId?: number;
  tvdbId?: number;
  seasonNumber?: number;
  episodeNumber?: number;
  absoluteEpisodeNumber?: number;
  airDate?: string;
  airDateUtc?: string;
  runtime?: number;
  overview?: string;
  image?: string;
  episode: string;
  anidbEid?: number;
  length?: number;
  airdate?: string;
  rating?: string;
  summary?: string;
  finaleType?: string;
}

// Main Dandadan Series export Interface
export interface EpisodeData {
  episodes: {
    [key: string]: Episode;
  };
  episodeCount: number;
  specialCount: number;
  images: SeriesImage[];
  mappings: Mappings;
}

export interface ITitle {
  romaji?: string;
  english?: string;
  native?: string;
  userPreferred?: string;
}

export interface ISearch<T> {
  currentPage?: number;
  hasNextPage?: boolean;
  totalPages?: number;
  /**
   * total results must include results from all pages
   */
  totalResults?: number;
  results: T[];
}

export interface Trailer {
  id: string;
  url?: string;
  site?: string;
  thumbnail?: string;
  thumbnailHash?: string | null;
}

export interface FuzzyDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface IAnimeResult {
  id: string;
  title: string | ITitle;
  url?: string;
  image?: string;
  imageHash?: string;
  cover?: string;
  coverHash?: string;
  status?: MediaStatus;
  rating?: number;
  type?: MediaFormat;
  releaseDate?: string;
  [x: string]: any; // other fields
}

enum MediaStatus {
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed',
  HIATUS = 'Hiatus',
  CANCELLED = 'Cancelled',
  NOT_YET_AIRED = 'Not yet aired',
  UNKNOWN = 'Unknown',
}

enum SubOrSub {
  SUB = 'sub',
  DUB = 'dub',
  BOTH = 'both',
}

export enum MediaFormat {
  TV = 'TV',
  TV_SHORT = 'TV_SHORT',
  TV_SPECIAL = 'TV_SPECIAL',
  MOVIE = 'MOVIE',
  SPECIAL = 'SPECIAL',
  OVA = 'OVA',
  ONA = 'ONA',
  MUSIC = 'MUSIC',
  MANGA = 'MANGA',
  NOVEL = 'NOVEL',
  ONE_SHOT = 'ONE_SHOT',
  PV = 'PV',
  COMIC = 'COMIC',
}

export interface IAnimeInfo extends IAnimeResult {
  malId?: number | string;
  genres?: string[];
  description?: string;
  status?: MediaStatus;
  totalEpisodes?: number;
  /**
   * @deprecated use `hasSub` or `hasDub` instead
   */
  subOrDub?: SubOrSub;
  hasSub?: boolean;
  hasDub?: boolean;
  synonyms?: string[];
  /**
   * two letter representation of coutnry: e.g JP for japan
   */
  countryOfOrigin?: string;
  isAdult?: boolean;
  isLicensed?: boolean;
  /**
   * `FALL`, `WINTER`, `SPRING`, `SUMMER`
   */
  season?: string;
  studios?: string[];
  color?: string;
  cover?: string;
  trailer?: Trailer;
  episodes?: EpisodeData[];
  startDate?: FuzzyDate;
  endDate?: FuzzyDate;
  recommendations?: IAnimeResult[];
  relations?: IAnimeResult[];
}

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
  subOrDub: "sub" | "dub";
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
