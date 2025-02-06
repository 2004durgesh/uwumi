/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import { View, Text, YStack, XStack, Spinner, styled, Progress } from 'tamagui';
import { Pressable, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useRef, useMemo, useState } from 'react';
import CustomImage from '@/components/CustomImage';
import { useRouter } from 'expo-router';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Captions, Eye, EyeOff, Mic } from '@tamagui/lucide-icons';
import {
  useEpisodesIdStore,
  useEpisodesStore,
  useWatchProgressStore,
  useAnimeEpisodes,
  useCurrentTheme,
  usePureBlackBackground,
  useMovieEpisodeStore,
} from '@/hooks';
import WavyAnimation from './WavyAnimation';
import { Episode, IMovieEpisode, MediaType } from '@/constants/types';
import NoResults from './NoResults';
import { formatTime } from '@/constants/utils';
import RippleButton from './RippleButton';

const LoadingState = () => (
  <YStack justifyContent="center" alignItems="center" minHeight={300}>
    <Spinner size="large" color="$color" />
  </YStack>
);

const StyledText = styled(Text, {
  fontWeight: '500',
  color: '$color1',
  fontSize: '$2.5',
  opacity: 0.7,
});

const EpisodeList = ({
  mediaType,
  provider,
  id,
  swipeable = false,
}: {
  mediaType: string;
  provider: string;
  id: string;
  swipeable?: boolean;
}) => {
  const swipeRef = useRef<SwipeableMethods>(null);
  const router = useRouter();
  const currentTheme = useCurrentTheme();
  const flashListRef = useRef<FlashList<Episode | IMovieEpisode>>(null);
  const hasScrolledRef = useRef(false);
  const [seasonNumber, setSeasonNumber] = useState(0);

  const currentEpisodeId = useEpisodesIdStore((state) => state.currentEpisodeId);
  const { data: episodeData, isLoading } = useAnimeEpisodes({ id, provider });
  const movieSeasons = useMovieEpisodeStore((state) => state.movieSeasons);
  const animeEpisodes = useMemo(() => (Array.isArray(episodeData) ? episodeData : []), [episodeData]);
  const episodes = useMemo(() => {
    if (mediaType === MediaType.MOVIE && movieSeasons?.[seasonNumber]?.episodes) {
      return movieSeasons[seasonNumber].episodes;
    }
    return animeEpisodes || [];
  }, [mediaType, movieSeasons, seasonNumber, animeEpisodes]);
  console.log('episodes', episodes);
  const progresses = useWatchProgressStore((state) => state.progresses);
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  // useEffect(() => {
  //   console.log("i cam in to pic");
  // }, []);

  const setEpisodes = useEpisodesStore((state) => state.setEpisodes);
  useEffect(() => {
    if (animeEpisodes) {
      setEpisodes(animeEpisodes);
    }
  }, [animeEpisodes, setEpisodes]);

  const currentEpisode = animeEpisodes.find((episode) => episode.id === currentEpisodeId);
  console.log(
    movieSeasons?.[seasonNumber]?.episodes?.map((episode) => episode),
    seasonNumber,
  );
  useEffect(() => {
    return () => {
      hasScrolledRef.current = false;
    };
  }, [currentEpisodeId]);

  const rightActions = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const THRESHOLD = 100;

    const animatedStyle = useAnimatedStyle(() => {
      const progress = Math.min(Math.abs(drag.value) / THRESHOLD, 1);
      return {
        transform: [
          {
            scale: withSpring(0.9 + progress * 0.1, {
              mass: 0.5,
              damping: 20,
              stiffness: 200,
            }),
          },
        ],
        opacity: withSpring(progress > 0 ? 1 : 0.7),
      };
    });

    const eyeIconStyle = useAnimatedStyle(() => {
      const progress = Math.min(Math.abs(drag.value) / THRESHOLD, 1);
      // Interpolate icon opacity based on progress
      const opacity = interpolate(progress, [0.5, 1], [1, 0], Extrapolation.CLAMP);
      return { opacity };
    });

    const eyeOffIconStyle = useAnimatedStyle(() => {
      const progress = Math.min(Math.abs(drag.value) / THRESHOLD, 1);
      const opacity = interpolate(progress, [0.5, 1], [0, 1], Extrapolation.CLAMP);
      return { opacity };
    });

    return (
      <Animated.View
        style={[
          animatedStyle,
          { width: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: currentTheme?.color4 },
        ]}>
        <Animated.View
          style={[{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }, eyeIconStyle]}>
          <Eye color="white" size={24} />
        </Animated.View>

        <Animated.View
          style={[
            { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
            eyeOffIconStyle,
          ]}>
          <EyeOff color="white" size={24} />
        </Animated.View>
      </Animated.View>
    );
  };

  const renderEpisodeProgress = useMemo(
    () => (item: Episode | IMovieEpisode) => {
      if (currentEpisodeId === item?.id) {
        return <WavyAnimation />;
      }

      const progress = progresses[item?.id];
      if (progress?.currentTime && progress?.progress < 90) {
        return (
          <StyledText>
            Progress: {formatTime(progress.currentTime)}/{formatTime(progress.duration)}
          </StyledText>
        );
      }

      return progress?.progress > 90 ? (
        <EyeOff opacity={0.7} color="white" size={15} />
      ) : (
        <Eye opacity={0.7} color="white" size={15} />
      );
    },
    [currentEpisodeId, progresses],
  );

  const renderPressableItem = ({ item }: { item: Episode | IMovieEpisode }) => {
    return (
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/watch/[mediaType]',
            params: {
              mediaType,
              provider,
              id,
              episodeId: item?.id,
              ...(item?.dubId ? { episodeDubId: item.dubId as string } : null),
              ...(item?.isDub ? { isDub: item.isDub as string } : null),
              poster: item?.image ?? item?.img?.hd,
              title: item?.title,
              description: item?.description,
              number: item?.number ?? item?.episode,
            },
          });
        }}>
        <YStack
          gap={'$4'}
          padding={2}
          marginVertical={1}
          borderWidth={2}
          borderRadius={10}
          borderColor={currentEpisodeId === item.id ? '$color4' : 'transparent'}
          backgroundColor={pureBlackBackground ? '#000' : '$background'}>
          <XStack gap={'$4'}>
            <View position="relative" overflow="hidden" borderRadius={8}>
              {/* 10 - 2 (of gap) = 8 */}
              <CustomImage source={item?.image || item?.img?.mobile} style={{ width: 160, height: 107 }} />
              <View
                position="absolute"
                bottom="$2.5"
                left="$2.5"
                backgroundColor="$background"
                opacity={0.8}
                borderRadius="$4"
                paddingHorizontal="$2"
                paddingVertical="$1">
                <Text fontSize="$3" fontWeight="700" color="$color">
                  EP {item.number ?? item.episode}
                </Text>
              </View>
              {progresses[item?.id] && swipeable && (
                <View position="absolute" bottom="$0" left="50%" transform={[{ translateX: '-50%' }]}>
                  <Progress
                    size={'$2'}
                    scaleX={1.15}
                    borderRadius={0}
                    backgroundColor="$color1"
                    value={Math.round(progresses[item?.id]?.progress) || 0}
                    max={100}>
                    <Progress.Indicator animation="bouncy" backgroundColor="$color4" />
                  </Progress>
                </View>
              )}
            </View>
            <YStack padding={2} flex={1} justifyContent="space-between">
              <YStack>
                <XStack alignItems="center" justifyContent="space-between" gap={2}>
                  <Text fontSize="$3" fontWeight="700" numberOfLines={1} flex={1}>
                    {item.title}
                  </Text>
                  <XStack gap={2}>
                    <Captions size={20} color="$color1" opacity={0.7} />
                    {item?.isDub && <Mic size={20} color="$color1" opacity={0.7} />}
                  </XStack>
                </XStack>
                <StyledText numberOfLines={4}>{item?.description}</StyledText>
              </YStack>

              <XStack justifyContent="space-between" alignItems="center">
                <View>{renderEpisodeProgress(item)}</View>
                <StyledText>{new Date(item?.airDate ?? item?.releaseDate ?? '').toDateString()}</StyledText>
              </XStack>
            </YStack>
          </XStack>
        </YStack>
      </Pressable>
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }
  return (
    <YStack flex={1} gap={2}>
      <XStack gap="$5" justifyContent="center" alignItems="center" flexWrap="wrap">
        {movieSeasons?.flatMap((_, index) => (
          <RippleButton
            key={index}
            onPress={() => {
              setSeasonNumber(index);
            }}>
            <Text
              backgroundColor={seasonNumber === index ? '$color4' : 'transparent'}
              textAlign="center"
              fontWeight="bold">
              {index}
            </Text>
          </RippleButton>
        ))}
      </XStack>

      <FlashList
        ref={flashListRef}
        data={episodes}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
        ListEmptyComponent={<NoResults />}
        ListFooterComponent={<View height={100} />}
        estimatedItemSize={150}
        showsVerticalScrollIndicator={true}
        estimatedFirstItemOffset={900}
        drawDistance={500}
        onLoad={(e) => {
          flashListRef?.current?.scrollToItem({
            item: currentEpisode,
            animated: true,
            viewPosition: 0.5,
          });
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: Episode | IMovieEpisode }) =>
          swipeable ? (
            <ReanimatedSwipeable
              ref={swipeRef}
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
              onSwipeableOpen={(e) => {
                console.log(e, 'eopened');
                if (swipeRef.current) {
                  swipeRef.current.close();
                }
              }}
              onSwipeableWillOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              onSwipeableWillClose={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              renderRightActions={rightActions}>
              {renderPressableItem({ item })}
            </ReanimatedSwipeable>
          ) : (
            renderPressableItem({ item })
          )
        }
      />
    </YStack>
  );
};
export default EpisodeList;
