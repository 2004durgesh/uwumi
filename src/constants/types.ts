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

export interface ExternalSubtitleData {
  MatchedBy: string;
  IDSubMovieFile: string;
  MovieHash: string;
  MovieByteSize: string;
  MovieTimeMS: string;
  IDSubtitleFile: string;
  SubFileName: string;
  SubActualCD: string;
  SubSize: string;
  SubHash: string;
  SubLastTS: string;
  SubTSGroup: string;
  InfoReleaseGroup: string;
  InfoFormat: string;
  InfoOther: string;
  IDSubtitle: string;
  UserID: string;
  SubLanguageID: string;
  SubFormat: string;
  SubSumCD: string;
  SubAuthorComment: string;
  SubAddDate: string;
  SubBad: string;
  SubRating: string;
  SubSumVotes: string;
  SubDownloadsCnt: string;
  MovieReleaseName: string;
  MovieFPS: string;
  IDMovie: string;
  IDMovieImdb: string;
  MovieName: string;
  MovieNameEng: string | null;
  MovieYear: string;
  MovieImdbRating: string;
  SubFeatured: string;
  UserNickName: string;
  SubTranslator: string;
  ISO639: string;
  LanguageName: string;
  SubComments: string;
  SubHearingImpaired: string;
  UserRank: string;
  SeriesSeason: string;
  SeriesEpisode: string;
  MovieKind: string;
  SubHD: string;
  SeriesIMDBParent: string;
  SubEncoding: string;
  SubAutoTranslation: string;
  SubForeignPartsOnly: string;
  SubFromTrusted: string;
  QueryCached: number;
  SubTSGroupHash: string;
  SubDownloadLink: string;
  ZipDownloadLink: string;
  SubtitlesLink: string;
  QueryNumber: string;
  QueryParameters: {
    episode: number;
    season: number;
    imdbid: string;
    sublanguageid: string;
  };
  Score: number;
}
