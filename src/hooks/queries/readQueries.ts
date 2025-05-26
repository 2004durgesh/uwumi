import { IMangaChapterPage, META } from 'react-native-consumet';
import { useQuery } from '@tanstack/react-query';
import { createProviderInstance, DEFAULT_PROVIDERS } from '@/constants/provider';
import { MediaType } from '@/constants/types';

export function useMangaChapterRead({ id, provider = DEFAULT_PROVIDERS.manga }: { id: string; provider: string }) {
  return useQuery<IMangaChapterPage[]>({
    queryKey: ['manga', 'read', id, provider],
    queryFn: async () => {
      try {
        const mangaProviderInitializer = createProviderInstance(MediaType.MANGA, provider);
        // console.log(id,"mangaProviderInitializer", mangaProviderInitializer);
        const data = (await new META.Anilist.Manga(mangaProviderInitializer).fetchChapterPages(
          id,
        )) as IMangaChapterPage[];
        // console.log(data);
        return data;
      } catch (error) {
        throw new Error(`Error fetching reading: ${error}`);
      }
    },
  });
}
