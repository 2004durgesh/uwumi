const animeProviders = [
  {
    name: 'zoro',
  },
  {
    name: 'gogoanime',
  },
];
const mangaProviders = [
  {
    name: 'mangadex',
  },
  {
    name: 'mangakakalot',
  },
];

const movieProviders = [
  {
    name: 'sflix',
  },
  {
    name: 'multimovies',
  },
  {
    name: 'dramacool',
  },
];

export { animeProviders, movieProviders, mangaProviders };
export const DEFAULT_ANIME_PROVIDER = 'zoro';
export const DEFAULT_MANGA_PROVIDER = 'mangadex';
export const DEFAULT_MOVIE_PROVIDER = 'sflix';
export const ANIME_META_PROVIDER = 'anilist';
export const MANGA_META_PROVIDER = 'anilist-manga';
export const MOVIE_META_PROVIDER = 'tmdb';
