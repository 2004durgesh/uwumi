import { Text } from 'react-native';
import React from 'react';
import { META } from 'react-native-consumet';
import { Button } from 'tamagui';
import { ThemedView } from '@/components/ThemedView';

const Example = () => {
  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      const anime = new META.Anilist();
      const search = await anime.search('the apothecary diaries season 2');
      console.log(search);
      const info = await anime.fetchEpisodesListById(search.results[0].id);
      console.log(info);
      // const sources = await anime.fetchEpisodeSources(info.episodes![0]!.id);
      // console.log(sources);
    } catch (error) {
      console.log(error);
      console.error('Error fetching data:', error);
    }
  };
  return (
    <ThemedView>
      <Button themeInverse onPress={() => fetchData()}>
        <Text>Press here</Text>
      </Button>
    </ThemedView>
  );
};

export default Example;
