/* eslint-disable react-hooks/rules-of-hooks */
import { createProviderInstance, DEFAULT_PROVIDERS } from '@/constants/provider';
import { IEpisodeServer, ISource, SubOrSub } from 'react-native-consumet';
import { useQuery } from '@tanstack/react-query';
// import { getFetchUrl } from '@/constants/utils';
import axios from 'axios';
import { MediaType } from '@/constants/types';

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
      try {
        // let url = `${getFetchUrl().apiUrl}/anime/${provider}/watch/${episodeId}?dub=${dub}`;
        // console.log(url);
        // const { data } = await axios.get(url);
        const animeProviderInitializer = createProviderInstance(MediaType.ANIME, provider);
        const data =
          provider === 'animepahe'
            ? await new animeProviderInitializer.fetchEpisodeSources(episodeId, dub ? SubOrSub.DUB : SubOrSub.SUB)
            : await new animeProviderInitializer.fetchEpisodeSources(
                episodeId,
                undefined,
                dub ? SubOrSub.DUB : SubOrSub.SUB,
              );
        return data;
      } catch (error) {
        console.error('Error fetching episode sources:', error);
        throw error;
      }
    },
  });
}

export function useWatchMoviesEpisodes({
  episodeId,
  mediaId,
  type,
  provider = DEFAULT_PROVIDERS.movie,
  server,
  embed,
}: {
  episodeId: string;
  mediaId: string;
  type: string;
  provider: string;
  server?: string;
  embed: boolean;
}) {
  // console.log('from query', server);
  return useQuery<ISource & { servers: IEpisodeServer[] }>({
    queryKey: ['watch', episodeId, mediaId, server, provider],
    queryFn: async () => {
      try {
        const moviesProviderInitializer = createProviderInstance(MediaType.MOVIE, provider);
        const data = (await new moviesProviderInitializer.fetchEpisodeSources(episodeId, mediaId)) as ISource;
        const servers = (await new moviesProviderInitializer.fetchEpisodeServers(
          episodeId,
          mediaId,
        )) as IEpisodeServer[];
        console.log('useWatchMoviesEpisodes', { ...data, servers });
        return { ...data, servers };
      } catch (error) {
        throw new Error(`Error fetching movies episode sources: ${error}`);
      }
    },
  });
}
// export function useMoviesEpisodesServers({
//   tmdbId,
//   episodeNumber,
//   seasonNumber,
//   type,
//   provider = DEFAULT_PROVIDERS.movie,
//   embed,
// }: {
//   tmdbId: string;
//   episodeNumber: string;
//   seasonNumber: string;
//   type: string;
//   provider: string;
//   embed: boolean;
// }) {
//   // console.log(tmdbId, episodeNumber, seasonNumber, type, provider);

//   return useQuery<IEpisodeServer[]>({
//     queryKey: ['watch', tmdbId, episodeNumber, seasonNumber, provider, embed],
//     queryFn: async () => {
//       try {
//         // console.log(
//         //   `${getFetchUrl().episodeApiUrl}/movies/tmdb/watch/${tmdbId}?episodeNumber=${episodeNumber}&seasonNumber=${seasonNumber}&type=${type.split(' ')[0].toLowerCase()}&server=${server}&embed=${embed}`,
//         // );
//         // const { data } = await axios.get(`${getFetchUrl().episodeApiUrl}/movies/tmdb/watch/${tmdbId}`, {
//         //   params: {
//         //     episodeNumber,
//         //     seasonNumber,
//         //     type: type.split(' ')[0].toLowerCase(),
//         //     ...(server && { server }),
//         //     provider,
//         //     embed,
//         //   },
//         // });
//         const moviesProviderInitializer = createProviderInstance(MediaType.MOVIE, provider);
//         const data = await new moviesProviderInitializer.fetchEpisodeServers(episodeId, mediaId);
//         console.log(data);
//         return data;
//       } catch (error) {
//         throw new Error(`Error fetching movies episode sources: ${error}`);
//       }
//     },
//   });
// }
