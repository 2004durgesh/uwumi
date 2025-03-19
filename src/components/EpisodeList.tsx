/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import { View, Text, YStack, XStack, Spinner, styled, Progress } from 'tamagui';
import { Pressable, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useRef, useMemo, useState, useCallback, memo } from 'react';
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
import { Captions, Eye, EyeOff, Mic, TableProperties, Images, ListOrdered } from '@tamagui/lucide-icons';
import {
  useEpisodesIdStore,
  useEpisodesStore,
  useWatchProgressStore,
  useAnimeEpisodes,
  useCurrentTheme,
  usePureBlackBackground,
  useEpisodeDisplayStore,
  useMoviesEpisodes,
  useServerStore,
  useSeasonStore,
} from '@/hooks';
import WavyAnimation from './WavyAnimation';
import { Episode, EpisodeDisplayMode, IMovieEpisode, MediaFormat, MediaType, TvType } from '@/constants/types';
import NoResults from './NoResults';
import { formatTime } from '@/constants/utils';
import CustomSelect from './CustomSelect';
import { PROVIDERS, useProviderStore } from '@/constants/provider';

const LoadingState = () => (
  <YStack justifyContent="center" alignItems="center" minHeight={300}>
    <Spinner size="large" color="$color" />
  </YStack>
);

const StyledText = styled(Text, { fontWeight: '500', color: '$color1', fontSize: '$2.5', opacity: 0.7 });

const EpisodeList = ({
  mediaType,
  provider,
  id,
  type,
  swipeable = false,
}: {
  mediaType: MediaType;
  provider: string;
  id: string;
  type?: MediaFormat | TvType;
  swipeable?: boolean;
}) => {
  const swipeableRefs = useRef<Map<string, SwipeableMethods>>(new Map());
  const router = useRouter();
  const currentTheme = useCurrentTheme();
  const flashListRef = useRef<FlashList<Episode | IMovieEpisode>>(null);
  const hasScrolledRef = useRef(false);
  const { setProvider, getProvider } = useProviderStore();
  useEffect(() => {
    setProvider(mediaType, getProvider(mediaType) ?? provider);
  }, [mediaType, provider, setProvider, getProvider]);
  const { data: episodeData, isLoading } =
    mediaType === MediaType.ANIME
      ? useAnimeEpisodes({ id, provider: getProvider(mediaType) })
      : useMoviesEpisodes({
          id,
          type: type!,
          provider: getProvider(mediaType) === 'rive' ? '' : getProvider(mediaType),
        });

  const { seasonNumber, setSeasonNumber, resetSeasonNumber } = useSeasonStore();
  const movieSeasons = episodeData?.seasons;
  // console.log('movieSeasons', movieSeasons);
  const animeEpisodes = useMemo(() => (Array.isArray(episodeData) ? episodeData : []), [episodeData]);
  const episodes = useMemo(() => {
    if (mediaType === MediaType.MOVIE && movieSeasons?.[seasonNumber]?.episodes) {
      return movieSeasons[seasonNumber].episodes;
    }
    return animeEpisodes || [];
  }, [mediaType, movieSeasons, seasonNumber, animeEpisodes]);
  // console.log('episodes', episodes);

  const { currentUniqueId } = useEpisodesIdStore();
  const progresses = useWatchProgressStore((state) => state.progresses);
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const { displayMode, setDisplayMode } = useEpisodeDisplayStore();
  const { setCurrentServer, getCurrentServer, servers } = useServerStore();

  // console.log('servers', servers[0], getCurrentServer());

  const [listKey, setListKey] = useState(0);
  useEffect(() => {
    setListKey((prev) => prev + 1);
  }, [displayMode]);

  const setEpisodes = useEpisodesStore((state) => state.setEpisodes);
  useEffect(() => {
    if (episodes) {
      setEpisodes(episodes);
      // console.log('episodes', episodes);
    }
  }, [episodes, setEpisodes]);

  useEffect(() => {
    if (swipeable) {
      resetSeasonNumber();
    }
  }, [id, resetSeasonNumber, swipeable]);

  useEffect(() => {
    if (movieSeasons && seasonNumber >= movieSeasons.length) {
      resetSeasonNumber();
    }
  }, [episodeData, movieSeasons, seasonNumber, resetSeasonNumber]);

  const currentEpisode = episodes.find((episode: Episode | IMovieEpisode) => episode.id === currentUniqueId);

  useEffect(() => {
    return () => {
      hasScrolledRef.current = false;
    };
  }, [currentUniqueId]);

  const handleProviderChange = useCallback(
    (value: string) => {
      setProvider(mediaType, value);
    },
    [mediaType, setProvider],
  );

  const rightActions = (_prog: SharedValue<number>, drag: SharedValue<number>) => {
    const THRESHOLD = 100;

    const animatedStyle = useAnimatedStyle(() => {
      const progress = Math.min(Math.abs(drag.value) / THRESHOLD, 1);
      return {
        transform: [{ scale: withSpring(0.9 + progress * 0.1, { mass: 0.5, damping: 20, stiffness: 200 }) }],
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
      if (currentUniqueId === item?.uniqueId) {
        return <WavyAnimation />;
      }

      const progress = progresses[item?.uniqueId];
      // console.log('progress', progress);
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
    [currentUniqueId, progresses],
  );

  const ListPressable = memo(({ item, children }: { item: Episode | IMovieEpisode; children: React.ReactNode }) => {
    return (
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/watch/[mediaType]',
            params: {
              mediaType,
              provider: getProvider(mediaType),
              id,
              episodeId: item?.id,
              ...(item?.dubId ? { episodeDubId: item.dubId as string } : null),
              ...(item?.isDub ? { isDub: item.isDub as string } : null),
              uniqueId: item?.uniqueId,
              poster: item?.image ?? item?.img?.hd ?? '',
              title: item?.title,
              description: item?.description,
              episodeNumber: item?.number ?? item?.episode,
              seasonNumber: item?.season,
              type,
            },
          });
        }}>
        <YStack
          gap={'$4'}
          padding={4}
          marginVertical={1}
          borderWidth={2}
          borderRadius={10}
          borderColor={currentUniqueId === item?.uniqueId ? '$color4' : 'transparent'}
          backgroundColor={pureBlackBackground ? '#000' : '$background'}>
          <XStack gap={'$4'}>{children}</XStack>
        </YStack>
      </Pressable>
    );
  });

  const ProgressAndAirDate = useCallback(
    ({ item }: { item: Episode | IMovieEpisode }) => {
      return (
        <XStack justifyContent="space-between" alignItems="center">
          <View>{renderEpisodeProgress(item)}</View>
          <StyledText>{new Date(item?.airDate ?? item?.releaseDate ?? '').toDateString()}</StyledText>
        </XStack>
      );
    },
    [renderEpisodeProgress],
  );

  const renderFullMetadataPressableItem = useCallback(
    ({ item }: { item: Episode | IMovieEpisode }) => {
      return (
        <ListPressable item={item}>
          <View position="relative" overflow="hidden" borderRadius={4}>
            {/* 10 - 4 (of gap) = 6 */}
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
            {progresses[item?.uniqueId] && swipeable && (
              <View position="absolute" bottom="$0" left="50%" transform={[{ translateX: '-50%' }]}>
                <Progress
                  size={'$2'}
                  scaleX={1.15}
                  borderRadius={0}
                  backgroundColor="$color1"
                  value={Math.round(progresses[item?.uniqueId]?.progress) || 0}
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
            {ProgressAndAirDate({ item })}
          </YStack>
        </ListPressable>
      );
    },
    [ListPressable, ProgressAndAirDate, progresses, swipeable],
  );

  const renderTitleOnlyPressableItem = useCallback(
    ({ item }: { item: Episode | IMovieEpisode }) => {
      return (
        <ListPressable item={item}>
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
            </YStack>
            {ProgressAndAirDate({ item })}
          </YStack>
        </ListPressable>
      );
    },
    [ListPressable, ProgressAndAirDate],
  );

  const renderNumberOnlyPressableItem = useCallback(
    ({ item }: { item: Episode | IMovieEpisode }) => {
      return (
        <ListPressable item={item}>
          <YStack padding={2} flex={1} justifyContent="space-between">
            <YStack>
              <XStack alignItems="center" justifyContent="space-between" gap={2}>
                <Text fontSize="$3" fontWeight="700" numberOfLines={1} flex={1}>
                  EP {item.number ?? item.episode}
                </Text>
                <XStack gap={2}>
                  <Captions size={20} color="$color1" opacity={0.7} />
                  {item?.isDub && <Mic size={20} color="$color1" opacity={0.7} />}
                </XStack>
              </XStack>
            </YStack>
            {ProgressAndAirDate({ item })}
          </YStack>
        </ListPressable>
      );
    },
    [ListPressable, ProgressAndAirDate],
  );

  const renderItemContent = useCallback(
    (item: Episode | IMovieEpisode) => {
      // console.log('renderContent', displayMode);
      switch (displayMode) {
        case EpisodeDisplayMode.FullMetadata:
          return renderFullMetadataPressableItem({ item });
        case EpisodeDisplayMode.TitleOnly:
          return renderTitleOnlyPressableItem({ item });
        case EpisodeDisplayMode.NumberOnly:
          return renderNumberOnlyPressableItem({ item });
        default:
          return renderFullMetadataPressableItem({ item });
      }
    },
    [renderFullMetadataPressableItem, renderTitleOnlyPressableItem, renderNumberOnlyPressableItem, displayMode],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <YStack flex={1} gap={2}>
      <XStack paddingHorizontal={16} paddingTop={8} gap="$5" alignItems="center">
        {movieSeasons && type !== TvType.MOVIE && (
          <CustomSelect
            SelectItem={
              movieSeasons?.map((_: any, index: number): { name: string; value: string } => ({
                name: `Season ${index + 1}`,
                value: String(index),
              })) || []
            }
            SelectLabel="Season"
            value={String(seasonNumber)}
            onValueChange={(value: string) => {
              console.log('value', value, seasonNumber);
              setSeasonNumber(Number(value));
              setEpisodes(movieSeasons[value].episodes);
            }}
          />
        )}
        {mediaType === MediaType.MOVIE && servers && servers.length > 0 && !swipeable && (
          <CustomSelect
            SelectItem={servers.map((server) => ({ name: server.name, value: server.name })) || []}
            SelectLabel="Servers"
            value={getCurrentServer()?.name!}
            onValueChange={(value: string) => setCurrentServer(value || servers[0].name)}
          />
        )}
        {mediaType === MediaType.ANIME && swipeable && (
          <CustomSelect
            SelectItem={mediaType === MediaType.ANIME ? PROVIDERS.anime : PROVIDERS.movie}
            SelectLabel="Provider"
            value={getProvider(mediaType)}
            onValueChange={handleProviderChange}
          />
        )}
        {swipeable && (
          <Pressable
            onPress={() => {
              // Cycle through display modes: FullMetadata -> TitleOnly -> NumberOnly -> FullMetadata
              setDisplayMode(
                displayMode === EpisodeDisplayMode.FullMetadata
                  ? EpisodeDisplayMode.TitleOnly
                  : displayMode === EpisodeDisplayMode.TitleOnly
                    ? EpisodeDisplayMode.NumberOnly
                    : EpisodeDisplayMode.FullMetadata,
              );
            }}>
            {displayMode === EpisodeDisplayMode.FullMetadata ? (
              <TableProperties color="$color" />
            ) : displayMode === EpisodeDisplayMode.TitleOnly ? (
              <ListOrdered color="$color" />
            ) : (
              <Images color="$color" />
            )}
          </Pressable>
        )}
      </XStack>
      <FlashList
        key={listKey}
        ref={flashListRef}
        data={episodes}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        ListEmptyComponent={<NoResults />}
        ListFooterComponent={<View height={100} />}
        estimatedItemSize={150}
        showsVerticalScrollIndicator={true}
        estimatedFirstItemOffset={900}
        drawDistance={500}
        onLoad={(e) => {
          flashListRef?.current?.scrollToItem({ item: currentEpisode, animated: true, viewPosition: 0.5 });
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: Episode | IMovieEpisode }) => {
          const itemKey = item?.id ?? item?.uniqueId;
          return swipeable ? (
            <ReanimatedSwipeable
              ref={(ref) => {
                if (ref) {
                  swipeableRefs.current.set(itemKey, ref);
                } else {
                  swipeableRefs.current.delete(itemKey);
                }
              }}
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
              onSwipeableOpen={(e) => {
                const currentRef = swipeableRefs.current.get(itemKey);
                if (currentRef) {
                  currentRef.close();
                }
              }}
              onSwipeableWillOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              onSwipeableWillClose={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              renderRightActions={rightActions}>
              {renderItemContent(item)}
            </ReanimatedSwipeable>
          ) : (
            renderItemContent(item as Episode | IMovieEpisode)
          );
        }}
      />
    </YStack>
  );
};
export default EpisodeList;
