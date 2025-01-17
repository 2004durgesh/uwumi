import { ThemedView } from '@/components/ThemedView';
import React from 'react';
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
