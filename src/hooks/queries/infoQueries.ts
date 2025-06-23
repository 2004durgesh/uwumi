import { createProviderInstance, DEFAULT_PROVIDERS } from '@/constants/provider';
import { MediaType, MetaProvider } from '@/constants/types';
import { useQuery } from '@tanstack/react-query';
import { IAnimeInfo, IMovieInfo, MediaFormat, META, TvType, IAnimeEpisode, IMangaChapter } from 'react-native-consumet';

export function useInfo({
  mediaType,
  metaProvider,
  type,
  id,
  provider,
}: {
  mediaType: MediaType;
  metaProvider: MetaProvider;
  type: MediaFormat | TvType;
  id: string;
  provider: string;
}) {
  // console.log('useInfo is called');
  return useQuery<IAnimeInfo | IMovieInfo>({
    queryKey: [mediaType, 'info', id, metaProvider, type, provider],
    queryFn: async () => {
      let data: IAnimeInfo | IMovieInfo | undefined;
      // const url =
      //   metaProvider === 'anilist'
      //     ? `${getFetchUrl().apiUrl}/meta/${metaProvider}/data/${id}`
      //     : `${getFetchUrl().apiUrl}/meta/${metaProvider}/info/${id}?type=${type.split(' ')[0]}`;
      // console.log(url);
      // const { data } = await axios.get(url, {
      //   params: { provider },
      // });
      try {
        if (metaProvider === 'anilist' || metaProvider === 'anilist-manga') {
          const [animeInfo, episodes] = await Promise.all([
            new META.Anilist().fetchAnilistInfoById(id),
            (() => {
              const animeProviderInitializer = createProviderInstance(MediaType.ANIME, provider);
              return new META.Anilist(animeProviderInitializer).fetchEpisodesListById(id);
            })(),
          ]);
          data = animeInfo as unknown as IAnimeInfo;
          data.episodes = episodes as unknown as IAnimeEpisode[];
        }
        if (metaProvider === 'tmdb') {
          const movieProviderInitializer = createProviderInstance(MediaType.MOVIE, provider);
          data = (await new META.TMDB(process.env.EXPO_TMDB_API_KEY, movieProviderInitializer).fetchMediaInfo(
            id,
            type,
          )) as unknown as IMovieInfo;
        }
      } catch (error) {
        console.error('Error fetching info data:', error);
        throw error;
      }
      if (!data) {
        throw new Error(`Unsupported meta provider: ${metaProvider}`);
      }
      // console.log(metaProvider, data);
      return data;
    },
  });
}

// export function useAnimeEpisodes({ id, provider = DEFAULT_PROVIDERS.anime }: { id: string; provider: string }) {
//   // console.log('useAnimeEpisodes is called');

//   return useQuery<IAnimeEpisode>({
//     queryKey: ['anime', 'episodes', id, provider],
//     queryFn: async () => {
//       try {
//         const animeProviderInitializer = createProviderInstance(MediaType.ANIME, provider);
//         const data = (await new META.Anilist(animeProviderInitializer).fetchEpisodesListById(id)) as unknown as Episode;
//         console.log(data);
//         return data;
//       } catch (error) {
//         throw new Error(`Error fetching episodes: ${error}`);
//       }
//     },
//   });
// }

export function useMangaChapters({ id, provider = DEFAULT_PROVIDERS.manga }: { id: string; provider: string }) {
  // console.log('useMangaEpisodes is called');

  return useQuery<IMangaChapter[]>({
    queryKey: ['manga', 'chapters', id, provider],
    queryFn: async () => {
      try {
        const mangaProviderInitializer = createProviderInstance(MediaType.MANGA, provider);
        const data = (await new META.Anilist.Manga(mangaProviderInitializer).fetchMangaInfo(id))
          .chapters as IMangaChapter[];
        // console.log(data);
        return data;
      } catch (error) {
        throw new Error(`Error fetching chapters: ${error}`);
      }
    },
  });
}

// export function useMoviesEpisodes({
//   id,
//   type,
//   provider = DEFAULT_PROVIDERS.movie,
// }: {
//   id: string;
//   type: MediaFormat | TvType;
//   provider: string;
// }) {
//   return useQuery<IMovieInfo>({
//     queryKey: ['movies', 'episodes', id, type, provider],
//     queryFn: async () => {
//       // let url = `${getFetchUrl().episodeApiUrl}/movies/tmdb/episodes/${id}?type=${type.split(' ')[0]}&provider=${provider}`;
//       // console.log(url);
//       // const { data } = await axios.get(url);
//       const movieProviderInitializer = createProviderInstance(MediaType.MOVIE, provider);
//       const data = (await new META.TMDB(process.env.EXPO_TMDB_API_KEY, movieProviderInitializer).fetchMediaInfo(
//         id,
//         type,
//       )) as unknown as IMovieInfo;
//       console.log(data);
//       return data;
//     },
//   });
// }
