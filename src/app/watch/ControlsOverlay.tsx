import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { YStack, XStack, Button, Text, View, Sheet, Spinner } from 'tamagui';
import { GestureResponderEvent } from 'react-native';
import {
  Play,
  Pause,
  Volume2,
  VolumeOff,
  Maximize,
  Minimize,
  Settings,
  Captions,
  CaptionsOff,
  SkipForward,
  SkipBack,
} from '@tamagui/lucide-icons';
import Animated, {
  FadeIn,
  FadeOut,
  Easing,
  FadeInDown,
  FadeOutDown,
  FadeInUp,
  FadeOutUp,
} from 'react-native-reanimated';
import { ISubtitle, MediaFormat, TvType } from 'react-native-consumet';
import { useRouter } from 'expo-router';
import { useCurrentTheme, useEpisodesIdStore, useEpisodesStore, useThemeStore } from '@/hooks';
import { formatTime } from '@/constants/utils';
import { VideoTrack } from './[mediaType]';
import RippleButton from '@/components/RippleButton';
import HorizontalTabs from '@/components/HorizontalTabs';
import SkiaSlider from './SkiaSlider';

interface ControlsOverlayProps {
  showControls: boolean;
  routeInfo: {
    mediaType: string;
    provider: string;
    id: string;
    type: MediaFormat | TvType;
    title: string;
    episodeNumber: string;
    seasonNumber: string;
  };
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isBuffering: boolean;
  subtitleTracks: ISubtitle[] | undefined;
  selectedSubtitleIndex: number | undefined;
  setSelectedSubtitleIndex: (index: number | undefined) => void;
  videoTracks: VideoTrack[] | undefined;
  selectedVideoTrackIndex: number | undefined;
  setSelectedVideoTrackIndex: (height: number | undefined) => void;
  currentTime: number;
  seekableDuration: number;
  onPlayPress: () => void;
  onMutePress: () => void;
  onFullscreenPress: () => void;
  onSeek: (time: number) => void;
}

const AnimatedYStack = Animated.createAnimatedComponent(YStack);
const AnimatedXStack = Animated.createAnimatedComponent(XStack);

const ControlsOverlay = memo(
  ({
    showControls,
    routeInfo,
    isPlaying,
    isMuted,
    isFullscreen,
    isBuffering,
    subtitleTracks,
    selectedSubtitleIndex,
    setSelectedSubtitleIndex,
    videoTracks,
    selectedVideoTrackIndex,
    setSelectedVideoTrackIndex,
    currentTime,
    seekableDuration,
    onPlayPress,
    onMutePress,
    onFullscreenPress,
    onSeek,
  }: ControlsOverlayProps) => {
    const [openSettings, setOpenSettings] = useState(false);
    const [isUserActive, setIsUserActive] = useState(true);
    const [sliderWidth, setSliderWidth] = useState(0);
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityTimeRef = useRef(Date.now());
    const controlsTimeoutDuration = 5000;

    const currentTheme = useCurrentTheme();

    // Function to reset inactivity timer with debounce protection
    const resetInactivityTimer = useCallback(() => {
      const now = Date.now();
      if (now - lastActivityTimeRef.current < 150) return;
      lastActivityTimeRef.current = now;

      setIsUserActive(true);

      // Clear any existing timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }

      // Set a new timer only if controls should auto-hide
      if (isPlaying && !openSettings && !isBuffering) {
        inactivityTimerRef.current = setTimeout(() => {
          setIsUserActive(false);
        }, controlsTimeoutDuration);
      }
    }, [isPlaying, openSettings, isBuffering]);

    // Setup the inactivity timer
    useEffect(() => {
      resetInactivityTimer();

      return () => {
        // Clean up timer when component unmounts
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
      };
    }, [resetInactivityTimer, isPlaying, openSettings]);

    useEffect(() => {
      resetInactivityTimer();
    }, [isPlaying, openSettings, resetInactivityTimer]);

    const handleUserActivity = useCallback(
      (e: GestureResponderEvent | React.SyntheticEvent) => {
        // Stop event from bubbling to prevent multiple calls
        e.stopPropagation();
        resetInactivityTimer();
      },
      [resetInactivityTimer],
    );
    const controlsVisible = openSettings || (showControls && isUserActive);

    const router = useRouter();
    const { mediaType, provider, id } = routeInfo;
    const prevUniqueId = useEpisodesIdStore((state) => state.prevUniqueId);
    const currentUniqueId = useEpisodesIdStore((state) => state.currentUniqueId);
    const nextUniqueId = useEpisodesIdStore((state) => state.nextUniqueId);
    const setEpisodeIds = useEpisodesIdStore((state) => state.setEpisodeIds);
    const episodes = useEpisodesStore((state) => state.episodes);
    const currentEpisodeIndex = episodes.findIndex((ep) => ep.uniqueId === currentUniqueId);
    const prevEpisodeIndex = episodes.findIndex((ep) => ep.uniqueId === prevUniqueId);
    const nextEpisodeIndex = episodes.findIndex((ep) => ep.uniqueId === nextUniqueId);
    const prevId = currentEpisodeIndex > 0 ? String(episodes[currentEpisodeIndex - 1].uniqueId) : null;
    const nextId =
      currentEpisodeIndex < episodes.length - 1 ? String(episodes[currentEpisodeIndex + 1].uniqueId) : null;
    const themeName = useThemeStore((state) => state.themeName);
    // console.log({
    //   prevUniqueId,
    //   currentUniqueId,
    //   nextUniqueId,
    //   episodes,
    //   currentEpisodeIndex,
    //   prevEpisodeIndex,
    //   nextEpisodeIndex,
    //   prevId,
    //   nextId,
    // });
    const SHEET_THEME_COLOR = themeName === 'light' ? '#ebeaf1' : '#0e0f15';
    // console.log('selectedSubtitleIndex', selectedSubtitleIndex, subtitleTracks![selectedSubtitleIndex!]);
    const tabItems = [
      {
        key: 'tab1',
        label: 'Quality',
        content: (
          <YStack flex={1} width="100%" gap="$2" alignSelf="flex-start" paddingHorizontal="$4">
            {videoTracks?.map((track, index) => (
              <RippleButton
                key={index}
                style={{
                  backgroundColor: SHEET_THEME_COLOR,
                }}
                onPress={() => {
                  // console.log(index, selectedSubtitleIndex, track.index);
                  setSelectedVideoTrackIndex(track.index);
                  setOpenSettings(false);
                }}>
                <Text color={selectedVideoTrackIndex === track.index ? '$color' : '$color1'}>{track.height}p</Text>
              </RippleButton>
            ))}
          </YStack>
        ),
      },
      {
        key: 'tab2',
        label: 'Subtitle',
        content: (
          <YStack flex={1} width="100%" gap="$2" alignSelf="flex-start" paddingHorizontal="$4">
            {subtitleTracks?.map((track, index) => (
              <RippleButton
                key={index}
                style={{
                  backgroundColor: SHEET_THEME_COLOR,
                }}
                onPress={() => {
                  setSelectedSubtitleIndex(index);
                  setOpenSettings(false);
                }}>
                <Text color={selectedSubtitleIndex === index ? '$color' : '$color1'}>{track.lang}</Text>
              </RippleButton>
            ))}
          </YStack>
        ),
      },
      {
        key: 'tab3',
        label: 'Audio',
        content: <Text>Working</Text>,
      },
    ];
    useEffect(() => {
      if (prevId || nextId) {
        setEpisodeIds(episodes[currentEpisodeIndex].id, currentUniqueId!, prevId, nextId);
      }
    }, [currentUniqueId, prevId, nextId, setEpisodeIds, episodes, currentEpisodeIndex]);
    /*
    subtitle-button:1
    settings-button: 2
    prev-episode-button:3
    play-pause-button:4
    next-episode-button:5
    mute-button:6
    skip-button:7
    fullscreen-button:8
     */

    return (
      <>
        <AnimatedYStack
          flex={1}
          justifyContent="space-between"
          backgroundColor={controlsVisible ? 'rgba(0, 0, 0, 0.5)' : 'transparent'}
          entering={FadeIn.duration(100).easing(Easing.bezierFn(0.25, 0.1, 0.25, 1))}
          exiting={FadeOut.duration(100).easing(Easing.bezierFn(0.25, 0.1, 0.25, 1))}
          onTouchStart={handleUserActivity}
          onMouseEnter={handleUserActivity}
          onMouseLeave={handleUserActivity}>
          {controlsVisible ? (
            <AnimatedXStack
              entering={FadeInUp.duration(100).easing(Easing.bezierFn(0.25, 0.1, 0.25, 1))}
              exiting={FadeOutUp.duration(100).easing(Easing.bezierFn(0.25, 0.1, 0.25, 1))}
              paddingVertical={isFullscreen ? '$5' : '$2'}
              paddingHorizontal={isFullscreen ? '$4' : '$2'}
              width="100%"
              justifyContent="space-between"
              alignItems="center">
              <YStack width="60%">
                <Text color="white" numberOfLines={1} fontWeight={700} fontSize="$3.5">
                  {routeInfo.title}
                </Text>
                <Text color="white" fontStyle="italic" fontWeight={500} fontSize="$2.5">
                  {routeInfo.seasonNumber ? `Season ${routeInfo.seasonNumber}` : null} Episode {routeInfo.episodeNumber}
                </Text>
              </YStack>
              <XStack gap="$4">
                {(selectedSubtitleIndex ?? -1) > -1 ? (
                  <RippleButton onPress={() => setSelectedSubtitleIndex(-1)}>
                    <Captions color="white" size={20} />
                  </RippleButton>
                ) : (
                  <RippleButton onPress={() => setSelectedSubtitleIndex(0)}>
                    <CaptionsOff color="white" size={20} />
                  </RippleButton>
                )}

                <RippleButton
                  onPress={() => {
                    setOpenSettings(!openSettings);
                  }}>
                  <Settings color="white" size={20} />
                </RippleButton>
                <Sheet
                  forceRemoveScrollEnabled={false}
                  modal={true}
                  open={openSettings}
                  onOpenChange={(value: boolean) => setOpenSettings(value)}
                  snapPoints={isFullscreen ? [80, 25] : [50, 25]}
                  snapPointsMode={'percent'}
                  dismissOnSnapToBottom
                  zIndex={100_000}
                  animation="quick">
                  <Sheet.Overlay
                    backgroundColor="transparent"
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                  <Sheet.Frame
                    backgroundColor={SHEET_THEME_COLOR}
                    marginHorizontal="auto"
                    width={isFullscreen ? '50%' : '90%'}>
                    <Sheet.ScrollView>
                      <HorizontalTabs items={tabItems} initialTab="tab1" />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                </Sheet>
              </XStack>
            </AnimatedXStack>
          ) : null}

          {/* Center play/pause button */}
          {controlsVisible || isBuffering ? (
            <AnimatedXStack
              entering={FadeIn.duration(100).easing(Easing.bezierFn(0.25, 0.1, 0.25, 1))}
              exiting={FadeOut.duration(100).easing(Easing.bezierFn(0.25, 0.1, 0.25, 1))}
              alignItems="center"
              gap="$8"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)">
              <RippleButton
                onPress={() => {
                  if (prevEpisodeIndex >= 0) {
                    router.push({
                      pathname: '/watch/[mediaType]',
                      params: {
                        mediaType,
                        provider,
                        id,
                        episodeId: episodes[prevEpisodeIndex].id,
                        uniqueId: episodes[prevEpisodeIndex].uniqueId,
                        ...(episodes[prevEpisodeIndex].dubId
                          ? { episodeDubId: episodes[prevEpisodeIndex].dubId as string }
                          : null),
                        ...(episodes[prevEpisodeIndex].isDubbed
                          ? { isDubbed: episodes[prevEpisodeIndex].isDubbed as string }
                          : null),
                        poster:
                          typeof episodes[prevEpisodeIndex].image === 'string'
                            ? episodes[prevEpisodeIndex].image
                            : episodes[prevEpisodeIndex].image?.hd,
                        title: episodes[prevEpisodeIndex].title,
                        description: episodes[prevEpisodeIndex].description,
                        episodeNumber: (episodes[prevEpisodeIndex].number ??
                          episodes[prevEpisodeIndex].episode) as string,
                        seasonNumber: episodes[prevEpisodeIndex].season as string,
                        type: routeInfo.type,
                      },
                    });
                  }
                }}>
                <SkipBack color={prevEpisodeIndex >= 0 ? 'white' : 'gray'} size={30} />
              </RippleButton>
              {isBuffering ? (
                <Spinner scale={2} size="large" color="white" />
              ) : (
                <RippleButton
                  onPress={() => {
                    onPlayPress();
                  }}>
                  {isPlaying ? <Pause color="white" size={40} /> : <Play color="white" size={40} />}
                </RippleButton>
              )}

              <RippleButton
                onPress={() => {
                  if (nextEpisodeIndex >= 0) {
                    router.push({
                      pathname: '/watch/[mediaType]',
                      params: {
                        mediaType,
                        provider,
                        id,
                        episodeId: episodes[nextEpisodeIndex].id,
                        uniqueId: episodes[nextEpisodeIndex].uniqueId,
                        ...(episodes[nextEpisodeIndex].dubId
                          ? { episodeDubId: episodes[nextEpisodeIndex].dubId as string }
                          : null),
                        ...(episodes[nextEpisodeIndex].isDubbed
                          ? { isDubbed: episodes[nextEpisodeIndex].isDubbed as string }
                          : null),
                        poster:
                          typeof episodes[nextEpisodeIndex].image === 'string'
                            ? episodes[nextEpisodeIndex].image
                            : episodes[nextEpisodeIndex].image?.hd,
                        title: episodes[nextEpisodeIndex].title,
                        description: episodes[nextEpisodeIndex].description,
                        episodeNumber: (episodes[nextEpisodeIndex].number ??
                          episodes[nextEpisodeIndex].episode) as string,
                        seasonNumber: episodes[nextEpisodeIndex].season as string,
                        type: routeInfo.type,
                      },
                    });
                  }
                }}>
                <SkipForward color={nextEpisodeIndex >= 0 ? 'white' : 'gray'} size={30} />
              </RippleButton>
            </AnimatedXStack>
          ) : null}

          {/* Bottom Controls */}
          {controlsVisible ? (
            <AnimatedYStack
              entering={FadeInDown.duration(100).easing(Easing.bezierFn(0.25, 0.1, 0.25, 1))}
              exiting={FadeOutDown.duration(100).easing(Easing.bezierFn(0.25, 0.1, 0.25, 1))}
              paddingVertical={isFullscreen ? '$5' : '$2'}
              paddingHorizontal={isFullscreen ? '$4' : '$2'}
              gap="$2">
              <XStack gap="$2" alignItems="center" justifyContent="space-between" width="100%">
                <RippleButton onPress={onMutePress}>
                  {isMuted ? <VolumeOff color="white" size={20} /> : <Volume2 color="white" size={20} />}
                </RippleButton>
                <XStack gap="$2" marginLeft="auto" alignItems="center">
                  <Button
                    onPress={() => onSeek(Math.round(currentTime) + 85)}
                    backgroundColor="$color"
                    color="$color4"
                    borderRadius="$10"
                    height="$3"
                    paddingHorizontal="$3"
                    fontWeight={500}
                    fontSize={13}>
                    +85 s
                  </Button>
                  <RippleButton onPress={onFullscreenPress}>
                    {isFullscreen ? <Minimize color="white" size={20} /> : <Maximize color="white" size={20} />}
                  </RippleButton>
                </XStack>
              </XStack>
              <XStack width="100%" alignItems="center" gap="$1" justifyContent="space-between">
                <Text color="white" fontSize={13} fontWeight={700}>
                  {formatTime(currentTime)}
                </Text>
                <View
                  flex={1}
                  onLayout={(e) => {
                    setSliderWidth(e.nativeEvent.layout.width);
                  }}>
                  <SkiaSlider
                    width={sliderWidth}
                    thumbColor={currentTheme?.color}
                    thumbSize={15}
                    activeTrackColor={currentTheme?.color}
                    initialValue={Math.round(currentTime)}
                    minValue={0}
                    maxValue={Math.round(seekableDuration)}
                    onValueChange={(value) => {
                      onSeek(value);
                    }}
                    onSlidingComplete={(value) => {
                      onSeek(value);
                    }}
                  />
                </View>
                <Text color="white" fontSize={13} fontWeight={700}>
                  {formatTime(seekableDuration)}
                </Text>
              </XStack>
            </AnimatedYStack>
          ) : null}
        </AnimatedYStack>
      </>
    );
  },
);
ControlsOverlay.displayName = 'ControlsOverlay';
export default ControlsOverlay;
