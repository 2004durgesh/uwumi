import MediaBrowser from '@/components/MediaBrowser';
import { ThemedView } from '@/components/ThemedView';
import { MediaType } from '@/constants/types';
import React from 'react';

const manga = () => {
  return (
    <ThemedView>
      <MediaBrowser mediaType={MediaType.MANGA} />
    </ThemedView>
  );
};

export default manga;
