import { ThemedView } from '@/components/ThemedView';
import { useAnimePopular, useAnimeSearch, useAnimeTrending } from '@/hooks/queries';
import React from 'react';
import { useSearchStore } from '@/hooks/stores/useSearchStore';
import MediaBrowser from '@/components/MediaBrowser';
import { MediaType } from '@/constants/types';

const Anime = () => {
  return (
    <ThemedView>
      <MediaBrowser mediaType={MediaType.ANIME} />
    </ThemedView>
  );
};

export default Anime;
