import { DEFAULT_ANIME_PROVIDER } from '@/constants/provider';
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
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      // console.log(data);
      return data;
    },
  });
}

export function useAnimeEpisodes({ id, provider = DEFAULT_ANIME_PROVIDER }: { id: string; provider: string }) {
  return useQuery<Episode>({
    queryKey: ['anime', 'episodes', id, provider],
    queryFn: async () => {
      console.log(`${getFetchUrl().episodeApiUrl}/${id}?provider=${provider}`);
      const { data } = await axios.get(`${getFetchUrl().episodeApiUrl}/${id}?provider=${provider}`);
      return data;
    },
  });
}
