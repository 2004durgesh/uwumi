import { DEFAULT_ANIME_PROVIDER } from '@/constants/provider';
import { Episode, IAnimeInfo } from '@/constants/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useAnimeInfo({ id, provider }: { id: string; provider: string }) {
  return useQuery<IAnimeInfo>({
    queryKey: ['anime', 'info', id, provider],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/data/${id}`, {
        params: { provider },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
      return data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useAnimeEpisodes({ id, provider = DEFAULT_ANIME_PROVIDER }: { id: string; provider: string }) {
  return useQuery<Episode>({
    queryKey: ['anime', 'episodes', id, provider],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.EXPO_PUBLIC_EPISODE_API_URL_DEV}/${id}?provider=${provider}`);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
    retryDelay: 1000,
  });
}
