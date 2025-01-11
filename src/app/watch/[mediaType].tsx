import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Dimensions, TouchableOpacity, StyleProp, ViewStyle, Pressable, StyleSheet } from 'react-native';
import Video, {
  ISO639_1,
  SelectedTrackType,
  SelectedVideoTrackType,
  TextTrackType,
  type VideoRef,
} from 'react-native-video';
import VideoPlayer from 'react-native-media-console';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { YStack, Spinner, Text, View } from 'tamagui';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlsOverlay from './ControlsOverlay';
import { ISubtitle } from '@/constants/types';
import { useWatchAnimeEpisodes } from '@/hooks/queries/watchQueries';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, withSpring, withSequence, withTiming, runOnJS } from 'react-native-reanimated';
import { useDoubleTapGesture } from '@/hooks/useDoubleTap';
import * as Brightness from 'expo-brightness';
import { VolumeManager } from 'react-native-volume-manager';

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

const Watch = () => {
  const { mediaType, provider, episodeId, episodeDubId, isDub, poster, title, description } = useLocalSearchParams<{
    mediaType: string;
    provider: string;
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
  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
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
  const [showSkipAnimation, setShowSkipAnimation] = useState(false);
  const [skipDirection, setSkipDirection] = useState<'forward' | 'backward'>('forward');
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
  const { doubleTapGesture, isDoubleTap, doubleTapValue, forwardAnimatedStyle, backwardAnimatedStyle } =
    useDoubleTapGesture({
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
  const verticalGesture = Gesture.Pan()
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
    });

  // Horizontal gesture handler for seeking
  const seekGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      'worklet';
      const MAX_SEEK_SECONDS = 15;
      const direction = Math.sign(event.translationX);
      const absTranslation = Math.abs(event.translationX);

      // Non-linear scaling for smoother control
      const scale = Math.min(absTranslation / dimensions.width, 1);
      const seekDelta = direction * scale * MAX_SEEK_SECONDS;

      const newTime = Math.max(0, Math.min(seekableDuration, currentTime + seekDelta));
      runOnJS(handleSeek)(newTime);
    });

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
      <GestureDetector gesture={Gesture.Race(verticalGesture, seekGesture, doubleTapGesture)}>
        <View height={isVideoReady ? playerDimensions.height : 250} top={top}>
          <TouchableOpacity
            onPress={() => {
              setShowControls(!showControls);
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
                  console.log('Video loaded:', value);
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
                onTextTracks={(tracks) => {
                  console.log('Text Tracks:', tracks);
                }}
                subtitleStyle={{ paddingBottom: 50, fontSize: 20, opacity: 0.8 }}
              />

              {isVideoReady && (
                <ControlsOverlay
                  showControls={showControls}
                  isPlaying={playbackState.isPlaying}
                  isMuted={isMuted}
                  isFullscreen={isFullscreen}
                  currentTime={currentTime}
                  seekableDuration={seekableDuration}
                  title={title}
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
          </TouchableOpacity>
          <Animated.View style={[styles.forwardIndicator, forwardAnimatedStyle]}>
            <Text style={styles.seekText}>+{doubleTapValue.forward}s</Text>
          </Animated.View>
          {isBuffering && (
            <View style={styles.centerOverlay}>
              <Spinner size="large" color="white" />
            </View>
          )}
          <Animated.View style={[styles.backwardIndicator, backwardAnimatedStyle]}>
            <Text style={styles.seekText}>-{doubleTapValue.backward}s</Text>
          </Animated.View>
        </View>
      </GestureDetector>
    </ThemedView>
  );
};

export default Watch;

const styles = StyleSheet.create({
  centerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  forwardIndicator: {
    position: 'absolute',
    right: '25%',
    top: '50%',
    transform: [{ translateY: -25 }], // Center the element by offsetting half its height
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 40,
  },
  backwardIndicator: {
    position: 'absolute',
    left: '25%',
    top: '50%',
    transform: [{ translateY: -25 }], // Center the element by offsetting half its height
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 40,
  },
  seekText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
