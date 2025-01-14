/* eslint-disable react/display-name */
import React, { memo } from 'react';
import { XStack, YStack, Spinner, Tabs, View, Card } from 'tamagui';
import CardList, { CardListProps } from '@/components/CardList';
import { ChartNoAxesCombined, Heart, Search } from '@tamagui/lucide-icons';
import { useSearchStore, useTabsStore } from '@/hooks/stores/useSearchStore';
import IconTitle from '@/components/IconTitle';
import SearchBar from '@/components/SearchBar';
import { MediaType } from '@/constants/types';
import { useAnimePopular, useAnimeSearch, useAnimeTrending } from '@/hooks/queries';
interface MediaBrowserProps {
  mediaType: MediaType;
}
const TabTextStyle = {
  fontSize: 13,
  fontWeight: '600',
  color: '$color2',
};

const TabIconStyle = {
  size: 15,
  color: '$color2',
};

const TABS = [
  { id: 'tab1', icon: ChartNoAxesCombined, text: 'Trending' },
  { id: 'tab2', icon: Heart, text: 'Popular' },
  { id: 'tab3', icon: Search, text: 'Search' },
] as const;

const MediaBrowser: React.FC<MediaBrowserProps> = ({ mediaType }) => {
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

  const currentTab = useTabsStore((state) => state.currentTab);
  const setCurrentTab = useTabsStore((state) => state.setCurrentTab);
  const TabList = memo(() => (
    <Tabs.List disablePassBorderRadius width="65%" marginVertical="$2" marginHorizontal="$4" gap="$2">
      {TABS.map(({ id, icon, text }) => (
        <Tabs.Tab
          key={id}
          flex={1}
          padding={0}
          height={35}
          value={id}
          borderWidth={2}
          borderColor={currentTab === id ? '$color4' : '$color2'}
          backgroundColor={currentTab === id ? '$color4' : '$background'}>
          <IconTitle icon={icon} text={text} iconProps={TabIconStyle} textProps={TabTextStyle} />
        </Tabs.Tab>
      ))}
    </Tabs.List>
  ));
  const TabContent = memo(({ data, error, isLoading, refetch, fetchNextPage, hasNextPage }: CardListProps) => {
    console.log('TabContent was rendered');
    return (
      <View height="100%">
        <CardList
          data={data}
          error={error}
          refetch={refetch}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
        />
      </View>
    );
  });
  return (
    <YStack gap="$2">
      <SearchBar />
      <Tabs
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        width="100%"
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value)}>
        <TabList />
        {Object.entries(tabsData).map(([key, props]: [string, CardListProps]) => (
          <Tabs.Content key={key} value={key}>
            <TabContent {...props} />
          </Tabs.Content>
        ))}
      </Tabs>
    </YStack>
  );
};

export default memo(MediaBrowser);
