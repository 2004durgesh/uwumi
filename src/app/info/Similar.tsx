import { View } from 'tamagui';
import React from 'react';
import { IAnimeInfo } from '@/constants/types';
import CardList from '@/components/CardList';

const Similar = ({ data }: { data: IAnimeInfo }) => {
  return (
    <View height="100%">
      <CardList data={data?.recommendations} />
    </View>
  );
};

export default Similar;
