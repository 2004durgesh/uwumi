import { IAnimeResult, ISearch, MediaFeedType, MediaType } from '@/constants/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useMediaFeed<T>(
  mediaType: MediaType,
  provider: string,
  type: MediaFeedType,
  options?: {
    params?: Record<string, unknown>;
    enabled?: boolean;
  },
) {
  return useInfiniteQuery({
    queryKey: [mediaType, type, provider],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get<ISearch<T>>(`${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/${provider}/${type}`, {
        params: {
          page: pageParam,
          ...options?.params,
        },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
      console.log(data);
      return data;
    },
    getNextPageParam: (lastPage: ISearch<T>, pages) => {
      if (lastPage.hasNextPage) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: options?.enabled ?? true,
  });
}

export function useSearch<T>(mediaType: MediaType, query: string, provider: string, type: MediaFeedType) {
  return useInfiniteQuery({
    queryKey: [mediaType, type, provider, query],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/${provider}/advanced-search`;
      const params = { page: pageParam.toString(), query: query };

      const { data } = await axios.get<ISearch<T>>(url, {
        params,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
      return data;
    },
    enabled: query.length > 0,
    getNextPageParam: (lastPage: ISearch<T>, pages) => {
      if (lastPage.hasNextPage) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
