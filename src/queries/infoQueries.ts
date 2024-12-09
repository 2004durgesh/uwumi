import { useQuery } from "@tanstack/react-query";

export function useAnimeInfo({ id, provider }: { id: string; provider: string }) {
  return useQuery({
    queryKey: ["anime", "info", id, provider],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/meta/anilist/info/${id}?provider=${provider}`
      );
      const json = await response.json();
      return json;
    },
  });
}