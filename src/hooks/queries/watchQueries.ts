import { DEFAULT_ANIME_PROVIDER } from '@/constants/provider';
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
