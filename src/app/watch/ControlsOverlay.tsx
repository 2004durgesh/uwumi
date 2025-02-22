import React, { memo, useEffect, useState } from 'react';
import { YStack, XStack, Button, Text, View, Slider, Sheet, Spinner } from 'tamagui';
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
import { ISubtitle } from '@/constants/types';
import { useRouter } from 'expo-router';
import { useEpisodesIdStore, useEpisodesStore, useThemeStore } from '@/hooks';
import { formatTime } from '@/constants/utils';
import { VideoTrack } from './[mediaType]';
import RippleButton from '@/components/RippleButton';
import HorizontalTabs from '@/components/HorizontalTabs';

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
  videoTracks: VideoTrack[] | undefined;
  selectedVideoTrackIndex: number | undefined;
  setSelectedVideoTrackIndex: (height: number | undefined) => void;
  currentTime: number;
  seekableDuration: number;
  title: string;
  onPlayPress: () => void;
  onMutePress: () => void;
  onFullscreenPress: () => void;
  onSeek: (time: number) => void;
}

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
    videoTracks,
    selectedVideoTrackIndex,
    setSelectedVideoTrackIndex,
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
    // console.log('episodes', episodes,currentEpisodeId,nextEpisodeId,prevEpisodeId);
    const currentEpisodeIndex = episodes.findIndex((ep) => ep.id === currentEpisodeId);
    const prevEpisodeIndex = episodes.findIndex((ep) => ep.id === prevEpisodeId);
    const nextEpisodeIndex = episodes.findIndex((ep) => ep.id === nextEpisodeId);
    const prevId = currentEpisodeIndex > 0 ? episodes[currentEpisodeIndex - 1].id : null;
    const nextId = currentEpisodeIndex < episodes.length - 1 ? episodes[currentEpisodeIndex + 1].id : null;
    const themeName = useThemeStore((state) => state.themeName);
    const SHEET_THEME_COLOR = themeName === 'light' ? '#ebeaf1' : '#0e0f15';
    console.log('selectedSubtitleIndex', selectedSubtitleIndex, subtitleTracks![selectedSubtitleIndex!]);
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
                  console.log(index, selectedSubtitleIndex, track.index);
                  setSelectedVideoTrackIndex(track.index);
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
        setEpisodeIds(currentEpisodeId!, prevId, nextId);
      }
    }, [currentEpisodeId, prevId, nextId, setEpisodeIds]);

    return showControls ? (
      <>
        <AnimatedYStack
          flex={1}
          justifyContent="space-between"
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
                <Sheet.Handle backgroundColor="$color4" />
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
          </XStack>
          {/* Center play/pause button */}
          <XStack
            alignItems="center"
            gap="$8"
            // backgroundColor= 'red'
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
            </RippleButton>
            {isBuffering ? (
              <Spinner size="large" color="white" />
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
            </RippleButton>
          </XStack>
          {/* Bottom Controls */}
          <YStack gap="$2">
            <XStack gap="$2" alignItems="center" justifyContent="space-between" width="100%">
              <RippleButton onPress={onMutePress}>
                {isMuted ? <VolumeOff color="white" size={20} /> : <Volume2 color="white" size={20} />}
              </RippleButton>
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
                <RippleButton onPress={onFullscreenPress}>
                  {isFullscreen ? <Minimize color="white" size={20} /> : <Maximize color="white" size={20} />}
                </RippleButton>
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
