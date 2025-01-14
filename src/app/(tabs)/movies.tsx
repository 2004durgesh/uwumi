import { ThemedView } from '@/components/ThemedView';
import { useMovieTrending } from '@/hooks/queries';
import React from 'react';
import { useSearchStore } from '@/hooks/stores/useSearchStore';
import MediaBrowser from '@/components/MediaBrowser';

const Movies = () => {
  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
    fetchNextPage: fetchNextTrending,
    hasNextPage: hasNextTrending,
  } = useMovieTrending();
  const tabsData = {
    tab1: {
      data: trendingData,
      error: trendingError,
      isLoading: trendingLoading,
      refetch: refetchTrending,
      fetchNextPage: fetchNextTrending,
      hasNextPage: hasNextTrending,
    },
  };
  return (
    <ThemedView>
      <MediaBrowser tabsData={tabsData} />
    </ThemedView>
  );
};

export default Movies;
