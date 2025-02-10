import { DEFAULT_ANIME_PROVIDER, DEFAULT_MOVIE_PROVIDER } from '@/constants/provider';
import { ISource } from '@/constants/types';
import { useQuery } from '@tanstack/react-query';
import { getFetchUrl } from '@/constants/utils';
import axios from 'axios';

export function useWatchAnimeEpisodes({
  episodeId,
  provider = DEFAULT_ANIME_PROVIDER,
}: {
  episodeId: string;
  provider: string;
}) {
  return useQuery<ISource>({
    queryKey: ['watch', episodeId, provider],
    queryFn: async () => {
      console.log(`${getFetchUrl().apiUrl}/meta/anilist/watch/${episodeId}?provider=${provider}`);
      const { data } = await axios.get(`${getFetchUrl().apiUrl}/meta/anilist/watch/${episodeId}?provider=${provider}`);
      return data;
    },
  });
}

export function useWatchMoviesEpisodes({
  tmdbId,
  episodeNumber,
  seasonNumber,
  type,
  server,
  provider = DEFAULT_MOVIE_PROVIDER,
}: {
  tmdbId: string;
  episodeNumber: string;
  seasonNumber: string;
  type: string;
  server?: string;
  provider: string;
}) {
  return useQuery<ISource>({
    queryKey: ['watch', tmdbId, episodeNumber, seasonNumber, server, provider],
    queryFn: async () => {
      console.log(
        `${getFetchUrl().episodeApiUrl}/movies/watch/${tmdbId}?episodeNumber=${episodeNumber}&seasonNumber=${seasonNumber}&type=${type.split(' ')[0].toLowerCase()}&server=${server}`,
      );
      const { data } = await axios.get(`${getFetchUrl().episodeApiUrl}/movies/watch/${tmdbId}`, {
        params: {
          episodeNumber,
          seasonNumber,
          type: type.split(' ')[0].toLowerCase(),
          ...(server && { server }),
          provider,
        },
      });
      console.log(data);
      return data;
    },
  });
}
