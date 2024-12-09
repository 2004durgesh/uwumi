import { useInfiniteQuery } from "@tanstack/react-query";

export function useAnimeTrending() {
  return useInfiniteQuery({
    queryKey: ["anime", "trending"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/meta/anilist/trending?page=${pageParam}`
      );
      const json = await response.json();
      return json;
    },
    getNextPageParam: (
      lastPage: {
        results: any;
        hasNextPage: boolean;
      },
      pages
    ) => {
      if (lastPage.hasNextPage) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
