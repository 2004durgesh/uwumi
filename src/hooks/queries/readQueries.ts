import { IMangaChapterPage } from '@/constants/types';
import { getFetchUrl } from '@/constants/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useMangaChapterRead({ id, provider = 'mangadex' }: { id: string; provider: string }) {
  return useQuery<IMangaChapterPage[]>({
    queryKey: ['manga', 'read', id, provider],
    queryFn: async () => {
      console.log(`${getFetchUrl().apiUrl}/meta/anilist-manga/read?chapterId=${id}&provider=${provider}`);
      const { data } = await axios.get(`${getFetchUrl().apiUrl}/meta/anilist-manga/read`, {
        params: { chapterId: id, provider: provider },
      });
      return data;
    },
  });
}
