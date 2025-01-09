import React, { useEffect, useMemo, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { Dimensions, TouchableOpacity, StyleProp, ViewStyle, Pressable, StyleSheet } from 'react-native';
import Video, { ISO639_1, SelectedTrackType, TextTrackType, type VideoRef } from 'react-native-video';
import VideoPlayer from 'react-native-media-console';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { YStack, Spinner, Text, View, styled } from 'tamagui';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlsOverlay from './ControlsOverlay';
import { ISubtitle } from '@/constants/types';
import { useWatchAnimeEpisodes } from '@/hooks/queries/watchQueries';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import { useDoubleTapGesture } from '@/hooks/useDoubleTap';
import * as Brightness from 'expo-brightness';
import { VolumeManager } from 'react-native-volume-manager';
import EpisodeList from '@/components/EpisodeList';
import { useEpisodesIdStore } from '@/hooks/stores/useEpisodesStore';

export interface SubtitleTrack {
  index: number;
  title?: string;
  language?: string;
  type?: WithDefault<'srt' | 'ttml' | 'vtt' | 'application/x-media-cues', 'srt'>;
  selected?: boolean;
  uri: string;
}

interface PlaybackState {
  isPlaying: boolean;
  isSeeking: boolean;
}

const SeekText = styled(Text, {
  fontSize: 10,
  fontWeight: 'bold',
  color: 'white',
  padding: 10,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 8,
});

const OverlayedView = styled(Animated.View, {
  position: 'absolute',
  top: 0,
  // width: 200,
  // height: 200,
  width: '50%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none',
  zIndex: 10,
  overflow: 'hidden',
  borderRadius: '50%',
  transform: [{ scale: 1.5 }],
  // backgroundColor: 'red',
});

const Watch = () => {
  const { mediaType, provider, id, episodeId, episodeDubId, isDub, poster, title, description } = useLocalSearchParams<{
    mediaType: string;
    provider: string;
    id: string;
    episodeId: string;
    episodeDubId: string;
    isDub: string;
    poster: string;
    title: string;
    description: string;
  }>();
  const { data, isLoading, error } = useWatchAnimeEpisodes({
    episodeId,
    provider,
  });
  const { top, right, bottom, left } = useSafeAreaInsets();
  const setEpisodeIds = useEpisodesIdStore((state) => state.setEpisodeIds);
  useEffect(() => {
    if (episodeId) {
      setEpisodeIds(episodeId);
    }
    return () => {
      setEpisodeIds('');
    };
  }, [setEpisodeIds, episodeId]);
  const videoRef = useRef<VideoRef>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekableDuration, setSeekableDuration] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    isSeeking: false,
  });
  const [playerDimensions, setPlayerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  const [subtitleTracks, setSubtitleTracks] = useState<ISubtitle[] | undefined>([]);
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState<number | undefined>(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [volume, setVolume] = useState(1);
  const [systemVolume, setSystemVolume] = useState(1);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => {
      subscription?.remove();
      const cleanup = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        SystemNavigationBar.navigationShow();
      };
      cleanup();
    };
  }, []);

  const enterFullscreen = async () => {
    try {
      SystemNavigationBar.stickyImmersive();
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsFullscreen(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      SystemNavigationBar.navigationShow();
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setIsFullscreen(false);
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  const handleProgress = ({ currentTime, seekableDuration }: { currentTime: number; seekableDuration: number }) => {
    setCurrentTime(currentTime);
    setSeekableDuration(seekableDuration);
  };

  const handlePlaybackStateChange = useCallback((state: PlaybackState) => {
    setPlaybackState(state);
    console.log('Playback State:', state);
  }, []);

  const handlePlayPress = useCallback(() => {
    if (videoRef.current) {
      if (playbackState.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.resume();
      }
    }
  }, [playbackState.isPlaying]);

  const handleMutePress = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleSeek = useCallback((value: number) => {
    videoRef.current?.seek(value);
    setCurrentTime(value);
  }, []);

  // Double tap gesture handlers for skip forward/backward
  const {
    doubleTapGesture,
    isDoubleTap,
    doubleTapValue,
    forwardAnimatedStyle,
    backwardAnimatedStyle,
    backwardRippleRef,
    forwardRippleRef,
    backwardAnimatedRipple,
    forwardAnimatedRipple,
  } = useDoubleTapGesture({
    videoRef,
    seekInterval: 10,
    onSeekStart: () => console.log('Seeking started'),
    onSeekEnd: () => console.log('Seeking ended'),
  });
  const updateBrightness = useCallback(async (value: number) => {
    await Brightness.setBrightnessAsync(value);
    setBrightness(value);
    console.log('bright:', value);
  }, []);

  useEffect(() => {
    const initVolume = async () => {
      const result = await VolumeManager.getVolume();
      setVolume(result.volume);
      setSystemVolume(result.volume);
    };

    initVolume();

    const volumeListener = VolumeManager.addVolumeListener((result) => {
      setVolume(result.volume);
      setSystemVolume(result.volume);
    });

    return () => volumeListener.remove();
  }, []);

  const updateVolume = useCallback(async (value: number) => {
    try {
      await VolumeManager.setVolume(value, { showUI: false });
      setVolume(value);
    } catch (error) {
      console.error('Failed to update volume:', error);
    }
  }, []);

  // Vertical gesture handler for brightness/volume
  const brightnessVolumeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-10, 10])
        .onUpdate((event) => {
          'worklet';
          const side = event.x < dimensions.width / 2 ? 'brightness' : 'volume';
          const delta = -event.translationY / 200;

          if (side === 'brightness') {
            const newBrightness = Math.max(0, Math.min(1, brightness + delta));
            runOnJS(updateBrightness)(newBrightness);
          } else {
            const newVolume = Math.max(0, Math.min(1, volume + delta));
            runOnJS(updateVolume)(newVolume);
          }
        }),
    [brightness, volume, dimensions.width, updateBrightness, updateVolume],
  );

  // Horizontal gesture handler for seeking
  // const seekGesture = useMemo(
  //   () =>
  //     Gesture.Pan()
  //       .activeOffsetX([-10, 10])
  //       .onUpdate((event) => {
  //         'worklet';
  //         const MAX_SEEK_SECONDS = 15;
  //         const direction = Math.sign(event.translationX);
  //         const absTranslation = Math.abs(event.translationX);

  //         // Non-linear scaling for smoother control
  //         const scale = Math.min(absTranslation / dimensions.width, 1);
  //         const seekDelta = direction * scale * MAX_SEEK_SECONDS;

  //         const newTime = Math.max(0, Math.min(seekableDuration, currentTime + seekDelta));
  //         runOnJS(handleSeek)(newTime);
  //       }),
  //   [dimensions.width, seekableDuration, currentTime, handleSeek],
  // );

  const toggleControls = useCallback(() => {
    setShowControls((showControls) => !showControls);
  }, []);

  const gestures = Gesture.Exclusive(doubleTapGesture, brightnessVolumeGesture);

  const videoStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      width: isFullscreen ? dimensions.width : '100%',
      height: isFullscreen ? dimensions.height : undefined,
      aspectRatio: isFullscreen ? undefined : 16 / 9,
      backgroundColor: 'black',
      position: 'absolute' as const,
      top: 0,
      left: isFullscreen ? right : 0,
      right: 0,
    }),
    [isFullscreen, dimensions, right],
  );
  const source = useMemo(
    () =>
      data?.sources?.find((s) => s.quality === 'default')?.url ||
      data?.sources?.find((s) => s.quality === 'backup')?.url ||
      data?.sources?.[0]?.url ||
      '',
    [data?.sources],
  );

  useEffect(() => {
    if (data?.subtitles && data?.subtitles?.length > 0) {
      setSubtitleTracks(data?.subtitles);
    }
    console.log('subtitle useeffect');
  }, [data?.subtitles]);

  if (isLoading) {
    return (
      <ThemedView useSafeArea={false}>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$color" />
        </YStack>
      </ThemedView>
    );
  }
  return (
    <ThemedView useSafeArea={false} useStatusBar>
      <View height="100%" top={top}>
        <GestureDetector gesture={gestures}>
          <View overflow="hidden" height={isVideoReady ? playerDimensions.height : 250}>
            <Pressable
              onPress={() => {
                if (isDoubleTap) return;
                toggleControls();
              }}
              style={{ flex: 1 }}>
              <View
                style={{ height: playerDimensions.height, position: 'relative' }}
                // style={{height:"100%", position: 'relative' }} //keep for future ref
              >
                <Video
                  ref={videoRef}
                  source={{
                    uri: source,
                    textTracks: subtitleTracks?.map((track, index) => ({
                      title: track.lang || 'Untitled',
                      language: track.lang?.toLowerCase() as ISO639_1,
                      type: TextTrackType.VTT,
                      uri: track.url || '',
                      index,
                    })),
                    textTracksAllowChunklessPreparation: false,
                  }}
                  style={videoStyle}
                  resizeMode={'contain'}
                  poster={{
                    source: { uri: poster },
                    resizeMode: 'contain',
                  }}
                  onProgress={handleProgress}
                  onPlaybackStateChanged={handlePlaybackStateChange}
                  onLayout={(e) => {
                    setPlayerDimensions({
                      width: e.nativeEvent.layout.width,
                      height: e.nativeEvent.layout.height,
                    });
                  }}
                  onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
                  onError={(error) => console.log('Video Error:', error)}
                  onLoad={(value) => {
                    // console.log('Video loaded:', value);
                    setIsVideoReady(true);
                  }}
                  // selectedVideoTrack={{
                  //   type: SelectedVideoTrackType.INDEX,
                  //   value: 0,
                  // }}
                  selectedTextTrack={{
                    type: SelectedTrackType.INDEX,
                    value: (selectedSubtitleIndex ?? 0) + 1,
                  }}
                  // onTextTracks={(tracks) => {
                  //   console.log('Text Tracks:', tracks);
                  // }}
                  subtitleStyle={{ paddingBottom: 50, fontSize: 20, opacity: 0.8 }}
                />
                {isVideoReady && (
                  <ControlsOverlay
                    showControls={showControls}
                    routeInfo={{ mediaType, provider, id }}
                    isPlaying={playbackState.isPlaying}
                    isMuted={isMuted}
                    isFullscreen={isFullscreen}
                    currentTime={currentTime}
                    seekableDuration={seekableDuration}
                    title={title}
                    isBuffering={isBuffering}
                    subtitleTracks={subtitleTracks}
                    selectedSubtitleIndex={selectedSubtitleIndex}
                    setSelectedSubtitleIndex={setSelectedSubtitleIndex}
                    onPlayPress={handlePlayPress}
                    onMutePress={handleMutePress}
                    onFullscreenPress={isFullscreen ? exitFullscreen : enterFullscreen}
                    onSeek={handleSeek}
                  />
                )}
              </View>
            </Pressable>
            <OverlayedView ref={backwardRippleRef} style={{ left: 0 }}>
              <Animated.View style={[backwardAnimatedRipple]}>
                <SeekText>-{doubleTapValue.backward}s</SeekText>
              </Animated.View>
            </OverlayedView>

            <OverlayedView ref={forwardRippleRef} style={{ right: 0 }}>
              <Animated.View style={[forwardAnimatedRipple]}>
                <SeekText>+{doubleTapValue.forward}s</SeekText>
              </Animated.View>
            </OverlayedView>
          </View>
        </GestureDetector>
        {!isFullscreen && (
          <View flex={1}>
            {description && (
              <Text padding={10} textAlign="justify">
                {description}
              </Text>
            )}
            <View flex={1}>
              <EpisodeList mediaType={mediaType} provider={provider} id={id} />
            </View>
          </View>
        )}

      </View>
    </ThemedView>
  );
};

export default Watch;

