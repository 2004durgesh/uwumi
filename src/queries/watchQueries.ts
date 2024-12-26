import { EpisodeData, IAnimeInfo } from "@/constants/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ISource {
    headers?: { [k: string]: string };
    intro?: Intro;
    outro?: Intro;
    subtitles?: ISubtitle[];
    sources: IVideo[];
    download?: string;
    embedURL?: string;
  }
  export interface Intro {
    start: number;
    end: number;
  }
  export interface ISubtitle {
    id?: string;
    url: string;
    lang: string;
  }

  export interface IVideo {
    url: string;
    quality?: string;
    isM3U8?: boolean;
    isDASH?: boolean;
    size?: number;
    [x: string]: unknown; 
  }

export function useWatchAnimeEpisodes({ episodeId,provider='gogoanime' }: { episodeId: string,provider:string }) {
  return useQuery<ISource>({
    queryKey: ["watch", episodeId,provider],
    queryFn: async () => {
      console.log(`${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/watch/${episodeId}?provider=${provider}`);
      const { data } = await axios.get(`${process.env.EXPO_PUBLIC_API_URL_DEV}/meta/anilist/watch/${episodeId}?provider=${provider}`);
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