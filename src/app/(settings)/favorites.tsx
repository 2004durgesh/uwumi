import CardList from '@/components/CardList';
import HorizontalTabs from '@/components/HorizontalTabs';
import { ThemedView } from '@/components/ThemedView';
import { MediaType } from '@/constants/types';
import { useFavoriteStore } from '@/hooks/stores/useFavoriteStore';
import React from 'react';

const Favorites = () => {
  const { favorites } = useFavoriteStore();
  const tabItems = [
    {
      key: 'tab1',
      label: 'Anime',
      content: <CardList staticData={favorites} mediaType={MediaType.ANIME} metaProvider="anilist" />,
    },
    {
      key: 'tab2',
      label: 'Manga',
      content: <CardList staticData={favorites} mediaType={MediaType.ANIME} metaProvider="anilist-manga" />,
    },
    {
      key: 'tab3',
      label: 'Movie',
      content: <CardList staticData={favorites} mediaType={MediaType.ANIME} metaProvider="tmdb" />,
    },
  ];
  return <ThemedView>{favorites && <HorizontalTabs items={tabItems} initialTab="tab1" />}</ThemedView>;
};

export default Favorites;
