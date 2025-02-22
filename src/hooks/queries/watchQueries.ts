/* eslint-disable react-hooks/rules-of-hooks */
import { DEFAULT_PROVIDERS } from '@/constants/provider';
import { IEpisodeServer, ISource } from '@/constants/types';
import { useQuery } from '@tanstack/react-query';
import { getFetchUrl } from '@/constants/utils';
import axios from 'axios';

export function useWatchAnimeEpisodes({
  episodeId,
  provider = DEFAULT_PROVIDERS.anime,
  dub = false,
}: {
  episodeId: string;
  provider: string;
  dub: boolean;
}) {
  // console.log(episodeId, provider, dub);
  return useQuery<ISource>({
    queryKey: ['watch', episodeId, provider, dub],
    queryFn: async () => {
      let url = `${getFetchUrl().apiUrl}/anime/${provider}/watch/${episodeId}?dub=${dub}`;
      console.log(url);
      const { data } = await axios.get(url);
      return data;
    },
  });
}

export function useWatchMoviesEpisodes({
  tmdbId,
  episodeNumber,
  seasonNumber,
  type,
  server = 'Ghost-HLS',
  provider = DEFAULT_PROVIDERS.movie,
}: {
  tmdbId: string;
  episodeNumber: string;
  seasonNumber: string;
  type: string;
  server?: string;
  provider: string;
}) {
  // console.log(tmdbId, episodeNumber, seasonNumber, type, server, provider);
  // useEffect(() => {
  //   const { setCurrentServer } = useServerStore();
  //   setCurrentServer(server);
  // }, [server]);

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
export function useMoviesEpisodesServers({
  tmdbId,
  episodeNumber,
  seasonNumber,
  type,
  provider = DEFAULT_PROVIDERS.movie,
}: {
  tmdbId: string;
  episodeNumber: string;
  seasonNumber: string;
  type: string;
  provider: string;
}) {
  // console.log(tmdbId, episodeNumber, seasonNumber, type, provider);

  return useQuery<IEpisodeServer[]>({
    queryKey: ['watch', tmdbId, episodeNumber, seasonNumber, provider],
    queryFn: async () => {
      console.log(
        `${getFetchUrl().episodeApiUrl}/movies/server/${tmdbId}?episodeNumber=${episodeNumber}&seasonNumber=${seasonNumber}&type=${type.split(' ')[0].toLowerCase()}`,
      );
      const { data } = await axios.get(`${getFetchUrl().episodeApiUrl}/movies/server/${tmdbId}`, {
        params: {
          episodeNumber,
          seasonNumber,
          type: type.split(' ')[0].toLowerCase(),
          provider,
        },
      });
      console.log(data);
      return data;
    },
  });
}
