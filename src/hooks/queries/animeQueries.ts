import { IAnimeResult, ISearch } from '@/constants/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useAnimeTrending() {
  return useInfiniteQuery({
    queryKey: ['anime', 'trending'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get<ISearch<IAnimeResult>>(
        `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/trending`,
        {
          params: { page: pageParam },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        },
      );
      return data;
    },
    getNextPageParam: (lastPage: ISearch<IAnimeResult>, pages) => {
      if (lastPage.hasNextPage) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    retry: 3,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retryDelay: 1000,
  });
}
