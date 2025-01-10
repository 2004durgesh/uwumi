import React from 'react';
import { Text, Card, ZStack, styled, XStack, Spinner, YStack, View } from 'tamagui';
import { Link } from 'expo-router';
import { LinearGradient } from 'tamagui/linear-gradient';
import { AnimatedCustomImage } from './CustomImage';
import { IAnimeResult, ISearch } from '@/constants/types';
import { RefreshControl } from 'react-native';
import { InfiniteData } from '@tanstack/react-query';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
interface CardListProps {
  data: InfiniteData<ISearch<IAnimeResult>> | IAnimeResult[] | undefined;
  hasNextPage?: boolean | undefined;
  fetchNextPage?: () => void;
  refetch?: () => void;
  isLoading?: boolean;
}

interface AnimeCardProps {
  item: IAnimeResult;
  index: number;
}

const StyledCard = styled(Card, {
  width: '100%',
  height: 190,
  // marginVertical: '$1.5',
  variants: {
    isHovered: {
      true: {
        scale: 0.95,
        borderColor: '$color',
      },
    },
  },
});

const AnimatedStyledCard = Animated.createAnimatedComponent(StyledCard);

const CustomCard: React.FC<AnimeCardProps> = ({ item, index }) => {
  return (
    <Link
      asChild
      href={{
        pathname: '/info/[mediaType]',
        params: {
          mediaType: 'anime',
          provider: 'zoro',
          id: item.id,
          image: item.image,
        },
      }}>
      <AnimatedStyledCard entering={FadeInDown.delay(50 * index)} elevate animation="bouncy">
        <Card.Footer paddingVertical="$2" paddingHorizontal="$2">
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            fontSize="$3"
            fontWeight="500"
            margin={0}
            width={100}
            color="#ffffff">
            {typeof item.title === 'string' ? item.title : item.title.romaji}
          </Text>
        </Card.Footer>
        <Card.Background>
          <ZStack width="100%" height="100%" alignItems="center" justifyContent="center">
            <AnimatedCustomImage
              source={{
                uri: item.image,
              }}
              style={{ borderRadius: 10 }}
              width={'100%'}
              height={190}
              contentFit="cover"
              sharedTransitionTag="shared-image"
            />
            <LinearGradient
              width={'100%'}
              height="100%"
              colors={['rgba(0,0,0,0.8)', 'transparent']}
              start={[0, 1]}
              end={[0, 0.3]}
              borderRadius={10}
              opacity={0.9}
            />
          </ZStack>
        </Card.Background>
      </AnimatedStyledCard>
    </Link>
  );
};

const CardList: React.FC<CardListProps> = ({ data, hasNextPage, fetchNextPage, refetch, isLoading }) => {
  const isInfiniteData = (
    data: InfiniteData<ISearch<IAnimeResult>> | IAnimeResult[] | undefined,
  ): data is InfiniteData<ISearch<IAnimeResult>> => {
    return !!data && 'pages' in data;
  };

  // Get the correct data array based on type
  const getItems = () => {
    if (!data) return [];
    if (isInfiniteData(data)) {
      return data.pages.flatMap((page) => page.results);
    }
    return data;
  };

  return (
    <YStack flex={1} alignItems="center" justifyContent="center">
      <FlashList
        data={getItems() || []}
        renderItem={({ item, index }: { item: IAnimeResult; index: number }) => (
          <CustomCard item={item} index={index} />
        )}
        ListEmptyComponent={<Text>No episodes found</Text>}
        estimatedItemSize={150}
        showsVerticalScrollIndicator={true}
        estimatedFirstItemOffset={900}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          padding: 1,
        }}
        ItemSeparatorComponent={() => <View style={{ width: 8, height: 8 }}><Text>ji</Text></View>}
        refreshControl={<RefreshControl refreshing={!!isLoading} onRefresh={refetch} />}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage?.();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasNextPage ? (
            <XStack padding="$4" justifyContent="center">
              <Spinner size="small" color="$color" />
            </XStack>
          ) : null
        }
      />
    </YStack>
  );
};

export default CardList;
