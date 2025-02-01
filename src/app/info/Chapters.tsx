import { IMangaChapter } from '@/constants/types';
import React from 'react';
import { Text, View } from 'tamagui';

const Chapters = ({ data }: { data?: IMangaChapter[] })=> {
  return (
    <View>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
};

export default Chapters;
