/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import { View, Text, YStack, XStack, Spinner, styled, Progress } from 'tamagui';
import { Pressable, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useRef, useMemo } from 'react';
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
} from '@/hooks';
import WavyAnimation from './WavyAnimation';
import { Episode } from '@/constants/types';
import NoResults from './NoResults';
import { formatTime } from '@/constants/utils';

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
  const flashListRef = useRef<FlashList<Episode>>(null);
  const hasScrolledRef = useRef(false);

  const currentEpisodeId = useEpisodesIdStore((state) => state.currentEpisodeId);
  const { data: episodeData, isLoading } = useAnimeEpisodes({ id, provider });
  const episodesList = useMemo(() => (Array.isArray(episodeData) ? episodeData : []), [episodeData]);
  const progresses = useWatchProgressStore((state) => state.progresses);
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  // useEffect(() => {
  //   console.log("i cam in to pic");
  // }, []);

  const setEpisodes = useEpisodesStore((state) => state.setEpisodes);
  useEffect(() => {
    if (episodesList) {
      setEpisodes(episodesList);
    }
  }, [episodesList, setEpisodes]);

  const currentEpisode = episodesList.find((episode) => episode.id === currentEpisodeId);

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
    () => (item: Episode) => {
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

  const renderPressableItem = ({ item }: { item: Episode }) => {
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
              episodeDubId: item?.dubId,
              isDub: item?.isDub,
              poster: item?.image,
              title: item?.title,
              description: item?.description,
              number: item?.number,
            },
          });
        }}>
        <YStack
          gap={'$4'}
          padding={2}
          marginVertical={1}
          borderWidth={1}
          borderRadius={10}
          borderColor={currentEpisodeId === item.id ? '$color4' : 'transparent'}
          backgroundColor={pureBlackBackground ? '#000' : '$background'}>
          <XStack gap={'$4'}>
            <View position="relative" overflow="hidden" borderRadius={8}>
              {/* 10 - 2 (of gap) = 8 */}
              <CustomImage source={item?.image} style={{ width: 160, height: 107 }} />
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
                  EP {item.number}
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
                <StyledText>{new Date(item?.airDate).toDateString()}</StyledText>
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
      <FlashList
        ref={flashListRef}
        data={episodesList || []}
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Episode }) =>
          swipeable ? (
            <ReanimatedSwipeable
              ref={swipeRef}
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
              onSwipeableOpen={(_: any, s: any) => s.close()}
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
