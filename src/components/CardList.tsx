import React from 'react';
import { Text, Card, ZStack, styled, XStack, Spinner } from 'tamagui';
import { Link } from 'expo-router';
import { LinearGradient } from 'tamagui/linear-gradient';
import { AnimatedCustomImage } from './CustomImage';
import { IAnimeInfo, IAnimeResult, ISearch } from '@/constants/types';
import { FlatList, RefreshControl } from 'react-native';
import { InfiniteData } from '@tanstack/react-query';
import Animated, { Easing, FadeIn, FadeInDown, FadeOutDown } from 'react-native-reanimated';
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
  width: '33%',
  height: 190,
  marginHorizontal: '$0.5',
  marginVertical: '$1',
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

const Animecard: React.FC<AnimeCardProps> = ({ item, index }) => {
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
      <AnimatedStyledCard
        entering={FadeInDown.delay(50 * index)}
        // exiting={FadeOutDown.duration(index*300).easing(
        //   Easing.inOut(Easing.bezierFn(0.25, 0.1, 0.25, 1))
        // )}
        // bordered
        elevate
        animation="bouncy"
        hoverStyle={{ scale: 0.7 }}
        pressStyle={{ scale: 0.9 }}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.25}
        shadowRadius={3.84}>
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
              width={135}
              height={190}
              contentFit="cover"
              sharedTransitionTag="shared-image"
            />
            <LinearGradient
              width={135}
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
    <FlatList
      data={getItems() || []}
      renderItem={({ item, index }: { item: IAnimeResult; index: number }) => <Animecard item={item} index={index} />}
      showsHorizontalScrollIndicator={false}
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
        ) : null
      }
    />
  );
};

export default CardList;
