import { ThemedView } from '@/components/ThemedView';
import { useAnimePopular, useAnimeTrending } from '@/hooks/queries';
import React, { useState } from 'react';
import { Text, XStack, YStack, H3, Spinner, Tabs, styled, View } from 'tamagui';
import CardList from '@/components/CardList';
import { ChartNoAxesCombined, Heart } from '@tamagui/lucide-icons';
import SearchBar from '@/components/SearchBar';

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

  const [currentTab, setCurrentTab] = useState('tab1');

  const TabText = styled(Text, {
    fontSize: 13,
    fontWeight: 500,
    color: '$color2',
  });

  if (trendingError || popularError) {
    const error = trendingError || popularError;
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="$color">Error: {error?.message}</Text>
      </YStack>
    );
  }

  return (
    <ThemedView>
      <YStack gap="$2">
        <SearchBar />
        <Tabs
          defaultValue="tab1"
          orientation="horizontal"
          flexDirection="column"
          width="100%"
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value)}>
          <Tabs.List disablePassBorderRadius width="50%" marginVertical="$2" marginHorizontal="$4" gap="$2">
            <Tabs.Tab
              flex={1}
              padding={0}
              height={35}
              value="tab1"
              borderWidth={2}
              borderColor={currentTab === 'tab1' ? '$color4' : '$color2'}
              backgroundColor={currentTab === 'tab1' ? '$color4' : '$background'}>
              <XStack gap="$2" alignItems="center">
                <ChartNoAxesCombined color="$color2" size={15} />
                <TabText>Trending</TabText>
              </XStack>
            </Tabs.Tab>

            <Tabs.Tab
              flex={1}
              padding={0}
              value="tab2"
              height={35}
              borderWidth={2}
              borderColor={currentTab === 'tab2' ? '$color4' : '$color2'}
              backgroundColor={currentTab === 'tab2' ? '$color4' : '$background'}>
              <XStack gap="$2" alignItems="center">
                <Heart color="$color2" size={15} />
                <TabText>Popular</TabText>
              </XStack>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Content value="tab1">
            {trendingLoading && !trendingData ? (
              <XStack padding="$4" justifyContent="center">
                <Spinner size="large" color="$color" />
              </XStack>
            ) : (
              <View height="100%">
                <CardList
                  data={trendingData}
                  refetch={refetchTrending}
                  fetchNextPage={fetchNextTrending}
                  hasNextPage={hasNextTrending}
                  isLoading={trendingLoading}
                />
              </View>
            )}
          </Tabs.Content>

          <Tabs.Content value="tab2">
            {popularLoading && !popularData ? (
              <XStack padding="$4" justifyContent="center">
                <Spinner size="large" color="$color" />
              </XStack>
            ) : (
              <View height="100%">
                <CardList
                  data={popularData}
                  refetch={refetchPopular}
                  fetchNextPage={fetchNextPopular}
                  hasNextPage={hasNextPopular}
                  isLoading={popularLoading}
                />
              </View>
            )}
          </Tabs.Content>
        </Tabs>
      </YStack>
    </ThemedView>
  );
};

export default Anime;
