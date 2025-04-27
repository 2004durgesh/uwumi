import { createProviderInstance, DEFAULT_PROVIDERS } from '@/constants/provider';
import { Episode, MediaType, MetaProvider } from '@/constants/types';
import { useQuery } from '@tanstack/react-query';
import { IAnimeInfo, IMovieInfo, MediaFormat, META, TvType, MOVIES, IAnimeEpisode } from 'react-native-consumet';

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
          data = (await new META.Anilist().fetchAnilistInfoById(id)) as unknown as IAnimeInfo;
        }
        if (metaProvider === 'tmdb') {
          data = (await new META.TMDB(undefined, new MOVIES.MultiMovies()).fetchMediaInfo(
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

export function useAnimeEpisodes({ id, provider = DEFAULT_PROVIDERS.anime }: { id: string; provider: string }) {
  // console.log('useAnimeEpisodes is called');

  return useQuery<IAnimeEpisode>({
    queryKey: ['anime', 'episodes', id, provider],
    queryFn: async () => {
      try {
        // console.log(`${getFetchUrl().episodeApiUrl}/anime/episodes/anilist/${id}?provider=${provider}`);
        // const { data } = await axios.get(
        //   `${getFetchUrl().episodeApiUrl}/anime/episodes/anilist/${id}?provider=${provider}`,
        // );
        const animeProviderInitializer = createProviderInstance(MediaType.ANIME, provider);
        const data = (await new META.Anilist(animeProviderInitializer).fetchEpisodesListById(id)) as unknown as Episode;
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(`Error fetching episodes: ${error}`);
      }
    },
  });
}

export function useMoviesEpisodes({
  id,
  type,
  provider = DEFAULT_PROVIDERS.movie,
}: {
  id: string;
  type: MediaFormat | TvType;
  provider: string;
}) {
  return useQuery<IMovieInfo>({
    queryKey: ['movies', 'episodes', id, type, provider],
    queryFn: async () => {
      // let url = `${getFetchUrl().episodeApiUrl}/movies/tmdb/episodes/${id}?type=${type.split(' ')[0]}&provider=${provider}`;
      // console.log(url);
      // const { data } = await axios.get(url);
      // console.log(data);
      const animeProviderInitializer = createProviderInstance(MediaType.MOVIE, provider);
      const data = (await new META.TMDB(process.env.EXPO_TMDB_API_KEY, animeProviderInitializer).fetchMediaInfo(
        id,
        type,
      )) as unknown as IMovieInfo;
      return data;
    },
  });
}
