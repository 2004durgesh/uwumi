import { IMovieResult, ISearch } from '@/constants/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useMovieTrending() {
  return useInfiniteQuery({
    queryKey: ['movie', 'trending'],
    queryFn: async ({ pageParam = 1 }) => {
      console.log(
        '🔍 Making request to:',
        `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/tmdb/trending?page=${pageParam}`,
      );
      const { data } = await axios.get<ISearch<IMovieResult>>(
        `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/tmdb/trending`,
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
    getNextPageParam: (lastPage: ISearch<IMovieResult>, pages) => {
      if (lastPage.hasNextPage) {
        const nextPage = pages.length + 1;
        return nextPage === 3 ? 4 : nextPage;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
