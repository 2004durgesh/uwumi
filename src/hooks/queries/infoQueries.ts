import { DEFAULT_ANIME_PROVIDER } from '@/constants/provider';
import { Episode, IAnimeInfo } from '@/constants/types';
import { getFetchUrl } from '@/constants/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useAnimeInfo({ id, provider }: { id: string; provider: string }) {
  return useQuery<IAnimeInfo>({
    queryKey: ['anime', 'info', id, provider],
    queryFn: async () => {
      const { data } = await axios.get(`${getFetchUrl().apiUrl}/meta/anilist/data/${id}`, {
        params: { provider },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
      console.log(data);
      return data;
    },
  });
}

export function useAnimeEpisodes({ id, provider = DEFAULT_ANIME_PROVIDER }: { id: string; provider: string }) {
  return useQuery<Episode>({
    queryKey: ['anime', 'episodes', id, provider],
    queryFn: async () => {
      const { data } = await axios.get(`${getFetchUrl().episodeApiUrl}/${id}?provider=${provider}`);
      return data;
    },
  });
}
