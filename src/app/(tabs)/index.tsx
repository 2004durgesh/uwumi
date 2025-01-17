import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import MediaBrowser from '@/components/MediaBrowser';
import { MediaType } from '@/constants/types';
import { Text } from 'tamagui';

const Anime = () => {
  return (
    <ThemedView>
      {/* <MediaBrowser mediaType={MediaType.ANIME} /> */}
      <Text>{process.env.NODE_ENV}</Text>
      <Text>{process.env.EXPO_PUBLIC_API_URL}</Text>
      <Text>{process.env.EXPO_PUBLIC_API_URL_DEV}</Text>
      <Text>{process.env.EXPO_PUBLIC_EPISODE_API_URL}</Text>
      <Text>{process.env.EXPO_PUBLIC_EPISODE_API_URL_DEV}</Text>
    </ThemedView>
  );
};

// [
//   'module-resolver',
//   {
//     root: ['./'],
//     alias: {
//       '@': './src',
//     },
//   },
// ],

export default Anime;
