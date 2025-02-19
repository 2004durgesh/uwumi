import { ISearch, MediaFeedType, MediaType, MetaProvider } from '@/constants/types';
import { getFetchUrl } from '@/constants/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useMediaFeed<T>(
  mediaType: MediaType,
  metaProvider: MetaProvider,
  mediaFeedType: MediaFeedType,
  options?: {
    params?: Record<string, unknown>;
    enabled?: boolean;
  },
) {
  return useInfiniteQuery({
    queryKey: [mediaType, mediaFeedType, metaProvider],
    queryFn: async ({ pageParam = 1 }) => {
      console.log(`${getFetchUrl().apiUrl}/meta/${metaProvider}/${mediaFeedType}?page=${pageParam}`);
      const { data } = await axios.get<ISearch<T>>(`${getFetchUrl().apiUrl}/meta/${metaProvider}/${mediaFeedType}`, {
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
      // console.log(data,"mediaquery");
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

export function useAnimeAndMangaSearch<T>(mediaType: MediaType, query: string) {
  return useInfiniteQuery({
    queryKey: [mediaType, query],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `${getFetchUrl().apiUrl}/meta/anilist/advanced-search`;
      const params = { page: pageParam.toString(), query: query, type: mediaType.toUpperCase() };
      console.log(url, params);

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
export function useMovieSearch<T>(mediaType: MediaType, query: string) {
  return useInfiniteQuery({
    queryKey: [mediaType, query],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `${getFetchUrl().apiUrl}/meta/tmdb/${query}`;
      const params = { page: pageParam.toString() };
      console.log(url, params);

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
