import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { YStack, XStack, Button, Text, View, Slider, Sheet, ScrollView, Spinner } from 'tamagui';
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
import Animated, { FadeIn, FadeOut, Easing } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { ISubtitle } from '@/constants/types';
import { useRouter } from 'expo-router';
import { useEpisodesIdStore, useEpisodesStore } from '@/hooks/stores/useEpisodesStore';

interface ControlsOverlayProps {
  showControls: boolean;
  routeInfo: {
    mediaType: string;
    provider: string;
    id: string;
  };
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isBuffering: boolean;
  subtitleTracks: ISubtitle[] | undefined;
  selectedSubtitleIndex: number | undefined;
  setSelectedSubtitleIndex: (index: number | undefined) => void;
  currentTime: number;
  seekableDuration: number;
  title: string;
  onPlayPress: () => void;
  onMutePress: () => void;
  onFullscreenPress: () => void;
  onSeek: (time: number) => void;
}

export const formatTime = (seconds: number): string => {
  // Handle invalid inputs
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  // Format with hours if present
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  // Ensure minutes are never negative
  const minutes = Math.max(0, m);
  return `${minutes}:${s.toString().padStart(2, '0')}`;
};

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

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
    currentTime,
    seekableDuration,
    title,
    onPlayPress,
    onMutePress,
    onFullscreenPress,
    onSeek,
  }: ControlsOverlayProps) => {
    const [openSettings, setOpenSettings] = useState(false);
    // console.log("settings are being shown", openSettings);
    const router = useRouter();
    const { mediaType, provider, id } = routeInfo;
    const prevEpisodeId = useEpisodesIdStore((state) => state.prevEpisodeId);
    const currentEpisodeId = useEpisodesIdStore((state) => state.currentEpisodeId);
    const nextEpisodeId = useEpisodesIdStore((state) => state.nextEpisodeId);
    const setEpisodeIds = useEpisodesIdStore((state) => state.setEpisodeIds);
    const episodes = useEpisodesStore((state) => state.episodes);
    const currentEpisodeIndex = episodes.findIndex((ep) => ep.id === currentEpisodeId);
    const prevEpisodeIndex = episodes.findIndex((ep) => ep.id === prevEpisodeId);
    const nextEpisodeIndex = episodes.findIndex((ep) => ep.id === nextEpisodeId);
    const prevId = currentEpisodeIndex > 0 ? episodes[currentEpisodeIndex - 1].id : null;
    const nextId = currentEpisodeIndex < episodes.length - 1 ? episodes[currentEpisodeIndex + 1].id : null;
    useEffect(() => {
      if (prevId || nextId) {
        setEpisodeIds(currentEpisodeId!, prevId, nextId);
      }
    }, [currentEpisodeId, prevId, nextId, setEpisodeIds]);

    return showControls ? (
      <>
        <AnimatedYStack
          flex={1}
          justifyContent="space-between"
          paddingHorizontal={isFullscreen ? '$10' : '$2'}
          paddingVertical={isFullscreen ? '$5' : '$2'}
          backgroundColor="rgba(0, 0, 0, 0.5)"
          entering={FadeIn.duration(300).easing(Easing.bezierFn(0.25, 0.1, 0.25, 1))}
          exiting={FadeOut.duration(100).easing(Easing.out(Easing.ease))}>
          <XStack width="100%" justifyContent="space-between" alignItems="center">
            <Text color="white" fontWeight={700} fontSize="$3.5">
              {title}
            </Text>
            <XStack gap="$4">
              {(selectedSubtitleIndex ?? -1) > -1 ? (
                <Captions color="white" size={20} onPress={() => setSelectedSubtitleIndex(-1)} />
              ) : (
                <CaptionsOff color="white" size={20} onPress={() => setSelectedSubtitleIndex(0)} />
              )}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setOpenSettings(!openSettings);
                }}>
                <Settings color="white" size={20} />
              </Pressable>
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
                <Sheet.Handle backgroundColor="$color4" />
                <Sheet.Overlay
                  backgroundColor="transparent"
                  animation="lazy"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame backgroundColor="#0e0f15" marginHorizontal="auto" width="95%">
                  <Sheet.ScrollView>
                    <YStack gap="$2">
                      <Button
                        backgroundColor={selectedSubtitleIndex === undefined ? '$color' : '#0e0f15'}
                        onPress={() => {
                          setSelectedSubtitleIndex(undefined);
                        }}>
                        Off
                      </Button>
                      {subtitleTracks?.map((track, index) => (
                        <Button
                          key={index}
                          backgroundColor={'#0e0f15'}
                          color={selectedSubtitleIndex === index ? '$color' : '$color1'}
                          onPress={() => {
                            setSelectedSubtitleIndex(index);
                          }}>
                          {track.lang}
                        </Button>
                      ))}
                    </YStack>
                  </Sheet.ScrollView>
                </Sheet.Frame>
              </Sheet> 
            </XStack>
          </XStack>

          {/* Center play/pause button */}
          <XStack alignItems="center" justifyContent="center" gap="$8">
            <Pressable
              onPress={() => {
                if (prevEpisodeIndex >= 0) {
                  router.push({
                    pathname: '/watch/[mediaType]',
                    params: {
                      mediaType,
                      provider,
                      id,
                      episodeId: episodes[prevEpisodeIndex].id,
                      episodeDubId: episodes[prevEpisodeIndex].dubId,
                      isDub: episodes[prevEpisodeIndex].isDub,
                      poster: episodes[prevEpisodeIndex].image,
                      title: episodes[prevEpisodeIndex].title,
                      description: episodes[prevEpisodeIndex].description,
                      number: episodes[prevEpisodeIndex].number,
                    },
                  });
                }
              }}>
              <SkipBack color={prevEpisodeIndex >= 0 ? 'white' : 'gray'} size={30} />
            </Pressable>
            {isBuffering ? (
              <Spinner size="large" color="white" />
            ) : (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onPlayPress();
                }}>
                {isPlaying ? <Pause color="white" size={40} /> : <Play color="white" size={40} />}
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                if (nextEpisodeIndex >= 0) {
                  router.push({
                    pathname: '/watch/[mediaType]',
                    params: {
                      mediaType,
                      provider,
                      id,
                      episodeId: episodes[nextEpisodeIndex].id,
                      episodeDubId: episodes[nextEpisodeIndex].dubId,
                      isDub: episodes[nextEpisodeIndex].isDub,
                      poster: episodes[nextEpisodeIndex].image,
                      title: episodes[nextEpisodeIndex].title,
                      description: episodes[nextEpisodeIndex].description,
                      number: episodes[nextEpisodeIndex].number,
                    },
                  });
                }
              }}>
              <SkipForward color={nextEpisodeIndex >= 0 ? 'white' : 'gray'} size={30} />
            </Pressable>
          </XStack>

          {/* Bottom Controls */}
          <YStack gap="$2">
            <XStack gap="$2" alignItems="center" justifyContent="space-between" width="100%">
              <Pressable onPress={onMutePress}>
                {isMuted ? <VolumeOff color="white" size={20} /> : <Volume2 color="white" size={20} />}
              </Pressable>
              <XStack gap="$2" marginLeft="auto" alignItems="center">
                <Button
                  backgroundColor="$color"
                  color="$color4"
                  borderRadius="$10"
                  height="$3"
                  paddingHorizontal="$3"
                  onPress={() => onSeek(Math.round(currentTime) + 85)}
                  fontWeight={500}
                  fontSize={13}>
                  +85 s
                </Button>
                <Pressable onPress={onFullscreenPress}>
                  {isFullscreen ? <Minimize color="white" size={20} /> : <Maximize color="white" size={20} />}
                </Pressable>
              </XStack>
            </XStack>
            <XStack width="100%" alignItems="center" gap="$4" justifyContent="space-between">
              <Text color="white" fontSize={13} fontWeight={700}>
                {formatTime(currentTime)}
              </Text>
              <View flex={1}>
                <Slider
                  value={[Math.round(currentTime)]}
                  min={0}
                  max={Math.round(seekableDuration)}
                  onValueChange={([value]) => {
                    onSeek(Math.round(value));
                  }}
                  step={1}>
                  <Slider.Track>
                    <Slider.TrackActive backgroundColor="$color" />
                  </Slider.Track>
                  <Slider.Thumb backgroundColor="$color" index={0} size={20} circular borderColor="$color" />
                </Slider>
              </View>
              <Text color="white" fontSize={13} fontWeight={700}>
                {formatTime(seekableDuration)}
              </Text>
            </XStack>
          </YStack>
        </AnimatedYStack>
      </>
    ) : null;
  },
);
ControlsOverlay.displayName = 'ControlsOverlay';
export default ControlsOverlay;
