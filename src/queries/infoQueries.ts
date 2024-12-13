import { EpisodeData, IAnimeInfo } from "@/constants/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAnimeInfo({ id, provider }: { id: string; provider: string }) {
  return useQuery<IAnimeInfo>({
    queryKey: ["anime", "info", id, provider],
    queryFn: async () => {
      // console.log( `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/info/${id}`);
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/data/${id}`,
        {
          params: { provider },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );
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

export function useAnimeEpisodes({ id }: { id: string}) {
  return useQuery<EpisodeData>({
    queryKey: ["anime", "episodes", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.ani.zip/mappings?anilist_id=${id}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );
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