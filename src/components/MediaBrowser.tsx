/* eslint-disable react/display-name */
import React, { memo } from 'react';
import { YStack, Tabs, View } from 'tamagui';
import CardList from '@/components/CardList';
import { ChartNoAxesCombined, Heart, Search } from '@tamagui/lucide-icons';
import { useTabsStore } from '@/hooks';
import IconTitle from '@/components/IconTitle';
import SearchBar from '@/components/SearchBar';
import { MediaType } from '@/constants/types';
interface MediaBrowserProps {
  mediaType: MediaType;
}
const TabTextStyle = {
  fontSize: 13,
  fontWeight: '600',
  // color: '$color2',
};

const TabIconStyle = {
  size: 15,
  // color: '$color2',
};

const TABS = [
  { id: 'tab1', icon: ChartNoAxesCombined, text: 'Trending', mediaFeedType: 'trending' },
  { id: 'tab2', icon: Heart, text: 'Popular', mediaFeedType: 'popular' },
  { id: 'tab3', icon: Search, text: 'Search', mediaFeedType: 'search' },
] as const;

const MediaBrowser: React.FC<MediaBrowserProps> = ({ mediaType }) => {
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
          borderColor={currentTab === id ? '$color4' : '$color1'}
          backgroundColor={currentTab === id ? '$color4' : 'transparent'}>
          <IconTitle icon={icon} text={text} iconProps={TabIconStyle} textProps={TabTextStyle} />
        </Tabs.Tab>
      ))}
    </Tabs.List>
  ));
  const metaProvider =
    mediaType === MediaType.ANIME ? 'anilist' : mediaType === MediaType.MANGA ? 'anilist-manga' : 'tmdb';
  console.log(metaProvider, mediaType);
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
        {TABS.map(({ id, mediaFeedType }) => (
          <Tabs.Content value={id} key={id}>
            <View height="100%">
              <CardList mediaFeedType={mediaFeedType} mediaType={mediaType} metaProvider={metaProvider} />
            </View>
          </Tabs.Content>
        ))}
      </Tabs>
    </YStack>
  );
};

export default memo(MediaBrowser);
