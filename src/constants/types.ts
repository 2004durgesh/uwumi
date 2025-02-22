export interface Episode {
  id: string;
  dubId?: string;
  uniqueId: string;
  isDub?: string;
  number: number;
  url: string;
  dubUrl?: string;
  image?: string;
  title: string;
  description?: string;
  airDate?: string;
  [x: string]: any;
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
  [x: string]: any;
}

enum MediaStatus {
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed',
  HIATUS = 'Hiatus',
  CANCELLED = 'Cancelled',
  NOT_YET_AIRED = 'Not yet aired',
  UNKNOWN = 'Unknown',
}
export enum MediaType {
  ANIME = 'anime',
  MANGA = 'manga',
  MOVIE = 'movie',
}

export type MediaFeedType = 'trending' | 'popular' | 'search';
export type MetaProvider = 'anilist' | 'anilist-manga' | 'tmdb';

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
  chapters?: IMangaChapter[];
  status?: MediaStatus;
  totalEpisodes?: number;
  subOrDub?: SubOrSub;
  hasSub?: boolean;
  hasDub?: boolean;
  synonyms?: string[];
  countryOfOrigin?: string;
  isAdult?: boolean;
  isLicensed?: boolean;
  season?: string;
  studios?: string[];
  color?: string;
  cover?: string;
  trailer?: Trailer;
  episodes?: Episode[];
  startDate?: FuzzyDate;
  endDate?: FuzzyDate;
  recommendations?: IAnimeResult[];
  relations?: IAnimeResult[];
}

export interface IMangaChapter {
  id: string;
  title: string;
  volumeNumber?: number | string;
  chapterNumber?: number | string;
  pages?: number;
  releaseDate?: string;
  [x: string]: unknown; // other fields
}

export interface IMangaChapterPage {
  img: string;
  page: number;
  [x: string]: unknown; // other fields
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

export interface ISource {
  headers?: { [k: string]: string };
  intro?: Intro;
  outro?: Intro;
  subtitles?: ISubtitle[];
  sources: IVideo[];
  download?: string;
  embedURL?: string;
  server?: string;
}
export interface IEpisodeServer {
  name: string;
  url: string;
}

export interface Intro {
  start: number;
  end: number;
}
export interface ISubtitle {
  id?: string;
  url: string;
  lang: string;
}

export interface IVideo {
  url: string;
  quality?: string;
  isM3U8?: boolean;
  isDASH?: boolean;
  size?: number;
  [x: string]: unknown;
}

export interface IMovieEpisode {
  id: string;
  uniqueId: string;
  title: string;
  url?: string;
  number?: number;
  season?: number;
  episode?: number;
  description?: string;
  image?: string;
  img?: {
    mobile?: string;
    hd?: string;
  };
  releaseDate?: string;
  [x: string]: unknown; // other fields
}

export enum TvType {
  TVSERIES = 'TV Series',
  MOVIE = 'Movie',
  ANIME = 'Anime',
  PEOPLE = 'People',
}

export interface IMovieResult {
  id: string;
  title: string | ITitle;
  url?: string;
  image?: string;
  releaseDate?: string;
  type?: TvType;
  [x: string]: unknown;
}

export interface IMovieSeason {
  season: number;
  img?: {
    mobile?: string;
    hd?: string;
  };
  episodes: IMovieEpisode[];
}

export interface IMovieInfo extends IMovieResult {
  cover?: string;
  recommendations?: IMovieResult[];
  genres?: string[];
  description?: string;
  rating?: number;
  status?: MediaStatus;
  duration?: string;
  production?: string;
  casts?: string[];
  tags?: string[];
  totalEpisodes?: number;
  trailer?: Trailer;
  seasons?: IMovieSeason[];
  episodes?: IMovieEpisode[];
}

export enum EpisodeDisplayMode {
  FullMetadata = 'full',
  TitleOnly = 'title',
  NumberOnly = 'number',
}
