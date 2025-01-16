import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import MediaBrowser from '@/components/MediaBrowser';
import { MediaType } from '@/constants/types';

const Movies = () => {
  return (
    <ThemedView>
      <MediaBrowser mediaType={MediaType.MOVIE} />
    </ThemedView>
  );
};

export default Movies;
