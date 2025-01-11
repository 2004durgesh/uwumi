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
  });
}

export function useAnimePopular() {
  return useInfiniteQuery({
    queryKey: ['anime', 'popular'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get<ISearch<IAnimeResult>>(
        `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/popular`,
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
  });
}
export function useAnimeSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ['anime', 'search', query],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/advanced-search`;
      const params = { page: pageParam.toString(), query: query };

      // Log full URL with params
      const fullUrl = `${url}?${new URLSearchParams(params).toString()}`;
      console.log('🔍 Making request to:', fullUrl);

      const { data } = await axios.get<ISearch<IAnimeResult>>(url, {
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
    getNextPageParam: (lastPage: ISearch<IAnimeResult>, pages) => {
      if (lastPage.hasNextPage) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
