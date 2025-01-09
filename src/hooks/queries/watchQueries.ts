import { DEFAULT_ANIME_PROVIDER } from '@/constants/provider';
import { IAnimeInfo, ISource } from '@/constants/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useWatchAnimeEpisodes({
  episodeId,
  provider = DEFAULT_ANIME_PROVIDER,
}: {
  episodeId: string;
  provider: string;
}) {
  return useQuery<ISource>({
    queryKey: ['watch', episodeId, provider],
    queryFn: async () => {
      console.log(`${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/watch/${episodeId}?provider=${provider}`);
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/watch/${episodeId}?provider=${provider}`,
      );
      console.log(data);
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
