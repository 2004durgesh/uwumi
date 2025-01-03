import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { YStack, XStack, Button, Text, View, Slider, Sheet, ScrollView } from 'tamagui';
import { Play, Pause, Volume2, VolumeOff, Maximize, Minimize, Settings } from '@tamagui/lucide-icons';
import Animated, { FadeIn, FadeOut, Easing } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { ISubtitle } from '@/constants/types';

interface ControlsOverlayProps {
  showControls: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  subtitleTracks: ISubtitle[] | undefined;
  selectedSubtitle: number | undefined;
  setSelectedSubtitle: (index: number | undefined) => void;
  currentTime: number;
  seekableDuration: number;
  title: string;
  onPlayPress: (e: any) => void;
  onMutePress: (e: any) => void;
  onFullscreenPress: (e: any) => void;
  onSeek: (time: number) => void;
}

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

const ControlsOverlay = React.memo(
  ({
    showControls,
    isPlaying,
    isMuted,
    isFullscreen,
    subtitleTracks,
    selectedSubtitle,
    setSelectedSubtitle,
    currentTime,
    seekableDuration,
    title,
    onPlayPress,
    onMutePress,
    onFullscreenPress,
    onSeek,
  }: ControlsOverlayProps) => {
    const [openSettings, setOpenSettings] = useState(false);
    return showControls ? (
      <>
        <AnimatedYStack
          flex={1}
          justifyContent="space-between"
          padding="$2"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          entering={FadeIn.duration(300).easing(Easing.bezierFn(0.25, 0.1, 0.25, 1))}
          exiting={FadeOut.duration(100).easing(Easing.out(Easing.ease))}
        >
          <XStack width="100%" justifyContent="space-between" alignItems="center">
            <Text color="white" fontWeight={700} fontSize="$3.5">
              {title}
            </Text>
            <XStack gap="$2">
              <Pressable onPress={() => setOpenSettings(!openSettings)}>
                <Settings color="white" size={20} />
              </Pressable>
              <Sheet
                forceRemoveScrollEnabled={false}
                modal={true}
                open={openSettings}
                onOpenChange={(value: boolean) => setOpenSettings(value)}
                snapPoints={[80, 25]}
                snapPointsMode={'percent'}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="quick"
              >
                <Sheet.Handle backgroundColor="$color4" />
                <Sheet.Overlay
                  backgroundColor="transparent"
                  animation="lazy"
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame backgroundColor="#0e0f15" marginHorizontal="auto" width="85%">
                  <Sheet.ScrollView>
                    <YStack gap="$2">
                      <Button
                        backgroundColor={selectedSubtitle === undefined ? '$color' : '$gray5'}
                        onPress={() => {
                          setSelectedSubtitle(undefined);
                        }}
                      >
                        Off
                      </Button>
                      {subtitleTracks?.map((track, index) => (
                        <Button
                          key={index}
                          backgroundColor={selectedSubtitle === index ? '$color' : '$gray5'}
                          onPress={() => {
                            setSelectedSubtitle(index);
                          }}
                        >
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
          <XStack justifyContent="center">
            <Pressable onPress={onPlayPress}>
              {isPlaying ? <Pause color="white" size={40} /> : <Play color="white" size={40} />}
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
                >
                  +85 s
                </Button>
                <Pressable onPress={onFullscreenPress}>
                  {isFullscreen ? <Minimize color="white" size={20} /> : <Maximize color="white" size={20} />}
                </Pressable>
              </XStack>
            </XStack>
            <XStack width="100%" alignItems="center" gap="$2" justifyContent="space-between">
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
                  step={1}
                >
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
  }
);

export default ControlsOverlay;
