import { ThemedView } from '@/components/ThemedView';
import { useAnimePopular, useAnimeSearch, useAnimeTrending } from '@/hooks/queries';
import React from 'react';
import { useSearchStore } from '@/hooks/stores/useSearchStore';
import MediaBrowser from '@/components/MediaBrowser';

const Anime = () => {
  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
    fetchNextPage: fetchNextTrending,
    hasNextPage: hasNextTrending,
  } = useAnimeTrending();

  const {
    data: popularData,
    isLoading: popularLoading,
    error: popularError,
    refetch: refetchPopular,
    fetchNextPage: fetchNextPopular,
    hasNextPage: hasNextPopular,
  } = useAnimePopular();

  const debouncedQuery = useSearchStore((state) => state.debouncedQuery);
  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
    fetchNextPage: fetchNextSearch,
    hasNextPage: hasNextSearch,
  } = useAnimeSearch(debouncedQuery);

  const tabsData = {
    tab1: {
      data: trendingData,
      error: trendingError,
      isLoading: trendingLoading,
      refetch: refetchTrending,
      fetchNextPage: fetchNextTrending,
      hasNextPage: hasNextTrending,
    },
    tab2: {
      data: popularData,
      error: popularError,
      isLoading: popularLoading,
      refetch: refetchPopular,
      fetchNextPage: fetchNextPopular,
      hasNextPage: hasNextPopular,
    },
    tab3: {
      data: searchData,
      error: searchError,
      isLoading: searchLoading,
      refetch: refetchSearch,
      fetchNextPage: fetchNextSearch,
      hasNextPage: hasNextSearch,
    },
  };

  return (
    <ThemedView>
      <MediaBrowser tabsData={tabsData} />
    </ThemedView>
  );
};

export default Anime;
