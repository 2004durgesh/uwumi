/* eslint-disable react/display-name */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, Card, ZStack, styled, XStack, Spinner, YStack, View } from 'tamagui';
import { Link } from 'expo-router';
import { LinearGradient } from 'tamagui/linear-gradient';
import { AnimatedCustomImage } from './CustomImage';
import { IAnimeResult, IMovieResult, ISearch } from '@/constants/types';
import { RefreshControl } from 'react-native';
import { InfiniteData } from '@tanstack/react-query';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import NoResults from './NoResults';
import { Image } from 'react-native';
export interface CardListProps {
  data: InfiniteData<ISearch<IAnimeResult>> | IAnimeResult[] | InfiniteData<ISearch<IMovieResult>> | undefined;
  error?: Error | null;
  hasNextPage?: boolean | undefined;
  fetchNextPage?: () => void;
  refetch?: () => void;
  isLoading?: boolean;
}

interface CardProps {
  item: IAnimeResult | IMovieResult;
  index: number;
}

const StyledCard = styled(Card, {
  width: '100%',
  height: 190,
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

const CustomCard: React.FC<CardProps> = memo(({ item, index }) => {
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
      <AnimatedStyledCard entering={FadeInDown.delay(50 * index)} flex={1} elevate animation="bouncy">
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
          <ZStack width="100%" height="100%" alignItems="center">
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
});

const CardList: React.FC<CardListProps> = ({ data, error, hasNextPage, fetchNextPage, refetch, isLoading }) => {
  const isInfiniteData = (
    data: InfiniteData<ISearch<IAnimeResult>> | IAnimeResult[] | InfiniteData<ISearch<IMovieResult>> | undefined,
  ): data is InfiniteData<ISearch<IAnimeResult>> | InfiniteData<ISearch<IMovieResult>> => {
    return !!data && 'pages' in data;
  };
  console.log('CardList was rendered');
  // Get the correct data array based on type
  const getItems = useMemo(() => {
    if (!data) return [];
    if (isInfiniteData(data)) {
      return data.pages.flatMap((page) => page.results as (IAnimeResult | IMovieResult)[]);
    }
    return data;
  }, [data]);

  if (isLoading && !data) {
    return (
      <XStack padding="$4" justifyContent="center">
        <Spinner size="large" color="$color" />
      </XStack>
    );
  }

  if (error) {
    return (
      <YStack justifyContent="center" alignItems="center">
        <NoResults />
        <Text fontSize="$4" color="$color4" textAlign="center" marginTop="$4">
          Error: {error?.message}
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1}>
      <FlashList
        data={getItems || []}
        renderItem={({ item, index }: CardProps) => (
          <View flex={1} paddingVertical={4} paddingHorizontal={4}>
            <CustomCard item={item} index={index} />
          </View>
        )}
        ListEmptyComponent={<NoResults />}
        estimatedItemSize={150}
        showsVerticalScrollIndicator={true}
        estimatedFirstItemOffset={900}
        drawDistance={500}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
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
          ) : (
            <View height={100} />
          )
        }
      />
    </YStack>
  );
};

export default memo(CardList);
