import { View } from 'tamagui';
import React from 'react';
import { IAnimeInfo, IMovieInfo } from '@/constants/types';
import CardList from '@/components/CardList';

const Similar = ({ data }: { data: IAnimeInfo | IMovieInfo }) => {
  return (
    <View height="100%">
      {/* @ts-ignore */}
      <CardList staticData={data?.recommendations} />
    </View>
  );
};

export default Similar;
