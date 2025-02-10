const animeProviders = [
  { name: 'Gogoanime', value: 'gogoanime' },
  { name: 'Zoro', value: 'zoro' },
];

const mangaProviders = [
  { name: 'Mangadex', value: 'mangadex' },
  { name: 'Mangakakalot', value: 'mangakakalot' },
];

const movieProviders = [
  { name: 'Rive', value: 'rive' },
  { name: 'MultiMovies', value: 'multimovies' },
  { name: 'FlixHQ', value: 'flixhq' },
  { name: 'SFlix', value: 'sflix' },
  { name: 'DramaCool', value: 'dramacool' },
];

export { animeProviders, movieProviders, mangaProviders };
export const DEFAULT_ANIME_PROVIDER = 'zoro';
export const DEFAULT_MANGA_PROVIDER = 'mangadex';
export const DEFAULT_MOVIE_PROVIDER = 'rive';
export const ANIME_META_PROVIDER = 'anilist';
export const MANGA_META_PROVIDER = 'anilist-manga';
export const MOVIE_META_PROVIDER = 'tmdb';
