import CardList from '@/components/CardList';
import HorizontalTabs from '@/components/HorizontalTabs';
import { ThemedView } from '@/components/ThemedView';
import { MediaType } from '@/constants/types';
import { useFavoriteStore } from '@/hooks/stores/useFavoriteStore';
import React from 'react';
import { Text, View } from 'tamagui';

const Favorites = () => {
  const { favorites } = useFavoriteStore();
  console.log(favorites);
  const tabItems = [
    {
      key: 'tab1',
      label: 'Anime',
      content: (
        <View height="100%">
          <CardList
            staticData={favorites.filter((item) => item.mediaType === MediaType.ANIME)}
            mediaType={MediaType.ANIME}
            metaProvider="anilist"
          />
        </View>
      ),
    },
    {
      key: 'tab2',
      label: 'Manga',
      content: (
        <View height="100%">
          <CardList
            staticData={favorites.filter((item) => item.mediaType === MediaType.MANGA)}
            mediaType={MediaType.MANGA}
            metaProvider="anilist-manga"
          />
        </View>
      ),
    },
    {
      key: 'tab3',
      label: 'Movie',
      content: (
        <View height="100%">
          <CardList
            staticData={favorites.filter((item) => item.mediaType === MediaType.MOVIE)}
            mediaType={MediaType.MOVIE}
            metaProvider="tmdb"
          />
        </View>
      ),
    },
  ];
  return <ThemedView>{favorites && <HorizontalTabs items={tabItems} initialTab="tab1" />}</ThemedView>;
};

export default Favorites;
