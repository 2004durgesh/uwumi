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

// export function useMoviePopular() {
//   return useInfiniteQuery({
//     queryKey: ['anime', 'popular'],
//     queryFn: async ({ pageParam = 1 }) => {
//       const { data } = await axios.get<ISearch<IMovieResult>>(
//         `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/popular`,
//         {
//           params: { page: pageParam },
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//           },
//           timeout: 5000,
//         },
//       );
//       return data;
//     },
//     getNextPageParam: (lastPage: ISearch<IMovieResult>, pages) => {
//       if (lastPage.hasNextPage) {
//         return pages.length + 1;
//       }
//       return undefined;
//     },
//     initialPageParam: 1,
//   });
// }
// export function useMovieSearch(query: string) {
//   return useInfiniteQuery({
//     queryKey: ['anime', 'search', query],
//     queryFn: async ({ pageParam = 1 }) => {
//       const url = `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/advanced-search`;
//       const params = { page: pageParam.toString(), query: query };

//       // const fullUrl = `${url}?${new URLSearchParams(params).toString()}`;
//       // console.log('🔍 Making request to:', fullUrl);

//       const { data } = await axios.get<ISearch<IMovieResult>>(url, {
//         params,
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//         timeout: 5000,
//       });
//       return data;
//     },
//     enabled: query.length > 0,
//     getNextPageParam: (lastPage: ISearch<IMovieResult>, pages) => {
//       if (lastPage.hasNextPage) {
//         return pages.length + 1;
//       }
//       return undefined;
//     },
//     initialPageParam: 1,
//   });
// }
