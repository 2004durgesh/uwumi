import { DEFAULT_PROVIDERS } from '@/constants/provider';
import { Episode, IAnimeInfo, IMovieInfo, MediaFormat, MediaType, MetaProvider, TvType } from '@/constants/types';
import { getFetchUrl } from '@/constants/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
  return useQuery<IAnimeInfo | IMovieInfo>({
    queryKey: [mediaType, 'info', id, metaProvider, type, provider],
    queryFn: async () => {
      const url =
        metaProvider === 'anilist'
          ? `${getFetchUrl().apiUrl}/meta/${metaProvider}/data/${id}`
          : `${getFetchUrl().apiUrl}/meta/${metaProvider}/info/${id}?type=${type.split(' ')[0]}`;
      console.log(url);
      const { data } = await axios.get(url, {
        params: { provider },
      });
      // console.log(data);
      return data;
    },
  });
}

export function useAnimeEpisodes({ id, provider = DEFAULT_PROVIDERS.anime }: { id: string; provider: string }) {
  return useQuery<Episode>({
    queryKey: ['anime', 'episodes', id, provider],
    queryFn: async () => {
      console.log(`${getFetchUrl().episodeApiUrl}/anime/episodes/anilist/${id}?provider=${provider}`);
      const { data } = await axios.get(
        `${getFetchUrl().episodeApiUrl}/anime/episodes/anilist/${id}?provider=${provider}`,
      );
      return data;
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
      let url = `${getFetchUrl().episodeApiUrl}/movies/tmdb/episodes/${id}?type=${type.split(' ')[0]}&provider=${provider}`;
      console.log(url);
      const { data } = await axios.get(url);
      console.log(data);
      return data;
    },
  });
}
