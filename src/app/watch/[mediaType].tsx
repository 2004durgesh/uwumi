/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Dimensions, StyleProp, ViewStyle, Pressable, StatusBar } from 'react-native';
import Video, {
  ISO639_1,
  SelectedTrackType,
  TextTrackType,
  SelectedVideoTrackType,
  type VideoRef,
} from 'react-native-video';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { YStack, Spinner, Text, View, styled, XStack, Button } from 'tamagui';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlsOverlay from './ControlsOverlay';
import { MediaType } from '@/constants/types';
import { ISubtitle, MediaFormat, TvType } from 'react-native-consumet';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import { ThemedView } from '@/components/ThemedView';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import * as Brightness from 'expo-brightness';
import { VolumeManager } from 'react-native-volume-manager';
import {
  useEpisodesIdStore,
  useWatchProgressStore,
  useDoubleTapGesture,
  useWatchAnimeEpisodes,
  useWatchMoviesEpisodes,
  useMoviesEpisodesServers,
  useServerStore,
  useCurrentTheme,
  usePureBlackBackground,
} from '@/hooks';
import EpisodeList from '@/components/EpisodeList';
import { toast } from 'sonner-native';
import axios from 'axios';
import { PROVIDERS, useProviderStore } from '@/constants/provider';
import { Check } from '@tamagui/lucide-icons';
import FullscreenModule from '../../../modules/fullscreen-module';

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

export interface VideoTrack {
  width?: number;
  height?: number;
  codecs?: string;
  index: number;
  bitrate?: number;
}

export interface AudioTrack {
  index: number;
  title?: string;
  language?: string;
  bitrate?: number;
  type?: string;
  selected?: boolean;
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
  const {
    mediaType,
    provider,
    id,
    mediaId,
    episodeId,
    uniqueId,
    isDubbed,
    poster,
    title,
    episodeNumber,
    seasonNumber,
    type,
  } = useLocalSearchParams<{
    mediaType: MediaType;
    provider: string;
    id: string;
    mediaId: string;
    episodeId: string;
    episodeDubId: string;
    uniqueId: string;
    isDubbed: string;
    poster: string;
    title: string;
    description: string;
    episodeNumber: string;
    seasonNumber: string;
    type: MediaFormat | TvType;
  }>();
  // console.log(useLocalSearchParams());

  const { top } = useSafeAreaInsets();
  const { setProgress, getProgress } = useWatchProgressStore();
  const { setProvider, getProvider } = useProviderStore();
  const { setServers, setCurrentServer, currentServer } = useServerStore();
  const [isEmbed, setIsEmbed] = useState<boolean>(true);
  const [serverInitialized, setServerInitialized] = useState(false);

  const setEpisodeIds = useEpisodesIdStore((state) => state.setEpisodeIds);
  const currentEpisodeId = useEpisodesIdStore((state) => state.currentEpisodeId);
  const currentTheme = useCurrentTheme();
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);

  useFocusEffect(
    useCallback(() => {
      // console.log('Screen focused - setting episode IDs');
      if (episodeId && uniqueId) {
        // console.log(`Setting episode IDs: ${episodeId}, ${uniqueId}`);
        setEpisodeIds(episodeId, uniqueId);
      }
      return () => {
        // console.log('Screen unfocused - clearing episode IDs');
        setEpisodeIds('', '');
      };
    }, [uniqueId, episodeId, setEpisodeIds]),
  );

  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekableDuration, setSeekableDuration] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [dub, setDub] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({ isPlaying: false, isSeeking: false });
  const [playerDimensions, setPlayerDimensions] = useState({ width: 0, height: 0 });
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  });
  const [wrapperDimensions, setWrapperDimensions] = useState({ width: 0, height: 0 });
  const { data, isLoading, error } =
    mediaType === MediaType.ANIME
      ? useWatchAnimeEpisodes({ episodeId: currentEpisodeId ?? episodeId, provider: getProvider(mediaType), dub })
      : useWatchMoviesEpisodes({
          episodeId: currentEpisodeId ?? episodeId,
          mediaId,
          type,
          provider,
          server: currentServer?.name,
          embed: isEmbed,
        });
  const {
    data: serverData,
    isLoading: isServerLoading,
    error: serverError,
  } = mediaType === MediaType.MOVIE
    ? useMoviesEpisodesServers({ tmdbId: id, episodeNumber, seasonNumber, type, provider, embed: isEmbed })
    : { data: undefined, isLoading: false, error: null };
  useEffect(() => {
    if (serverData && !serverInitialized) {
      setServers(serverData);
      console.log('Current Server:', serverData);
      if (serverData.length > 0) {
        setCurrentServer(serverData[0].name);
      }
      setServerInitialized(true);
    }
  }, [serverData, setCurrentServer, setServers, serverInitialized]);
  useEffect(() => {
    setServerInitialized(false);
  }, [isEmbed, provider]);

  const [subtitleTracks, setSubtitleTracks] = useState<ISubtitle[] | undefined>([]);
  const [NullSubtitleIndex, setNullSubtitleIndex] = useState<number | undefined>(0);
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState<number | undefined>(0);
  const [videoTracks, setVideoTracks] = useState<VideoTrack[]>();
  const [selectedVideoTrackIndex, setSelectedVideoTrackIndex] = useState<number | undefined>(0);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>();
  const [isBuffering, setIsBuffering] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [volume, setVolume] = useState(1);
  const [systemVolume, setSystemVolume] = useState(1);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setDimensions({ width: screen.width, height: screen.height });
    });

    return () => {
      subscription?.remove();
      const cleanup = async () => {
        StatusBar.setHidden(false);
        SystemNavigationBar.setNavigationColor(
          pureBlackBackground ? currentTheme?.color5 : currentTheme?.color3 || 'black',
        );
        SystemNavigationBar.navigationShow();
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        await FullscreenModule.exitFullscreen();
      };
      cleanup();
    };
  }, []);

  const enterFullscreen = async () => {
    try {
      StatusBar.setHidden(true);
      await FullscreenModule.enterFullscreen();

      SystemNavigationBar.stickyImmersive();
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

      setIsFullscreen(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      StatusBar.setHidden(false);
      SystemNavigationBar.setNavigationColor(
        pureBlackBackground ? currentTheme?.color5 : currentTheme?.color3 || 'black',
      );
      SystemNavigationBar.navigationShow();
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      await FullscreenModule.exitFullscreen();
      setIsFullscreen(false);
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  const handleProgress = ({ currentTime, seekableDuration }: { currentTime: number; seekableDuration: number }) => {
    setCurrentTime(currentTime);
    setSeekableDuration(seekableDuration);
    if (uniqueId && seekableDuration > 0 && Math.floor(currentTime) % 5 === 0) {
      const savedProgress = getProgress(uniqueId);

      if (!savedProgress || currentTime > savedProgress.currentTime) {
        const progress = {
          currentTime: currentTime,
          duration: seekableDuration,
          progress: (currentTime / seekableDuration) * 100,
        };
        // console.log('Saving intermediate progress:', progress);
        setProgress(uniqueId, progress);
      }
    }
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
    backwardRippleRef,
    forwardRippleRef,
    backwardAnimatedRipple,
    forwardAnimatedRipple,
  } = useDoubleTapGesture({
    videoRef,
    seekInterval: 10,
    // onSeekStart: () => console.log('Seeking started'),
    // onSeekEnd: () => console.log('Seeking ended'),
  });
  const updateBrightness = useCallback(async (value: number) => {
    await Brightness.setBrightnessAsync(value);
    setBrightness(value);
    console.log('bright:', value * 100);
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
      console.log('volume:', value * 100);
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
    setShowControls((isShowControls) => !isShowControls);
  }, []);

  // const singleTapGesture = useMemo(
  //   () =>
  //     Gesture.Tap().onEnd(() => {
  //       'worklet';
  //       runOnJS(toggleControls)();
  //       console.log('Toggled controls');
  //     }),
  //   [toggleControls],
  // );

  const videoStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      width: isFullscreen ? dimensions.width : '100%',
      height: isFullscreen ? dimensions.height : undefined,
      aspectRatio: isFullscreen ? undefined : 16 / 9,
      backgroundColor: 'black',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
    }),
    [isFullscreen, dimensions],
  );
  // console.log(videoStyle);
  // const source ="https://cdn-xqrgj99p8krmzj4e.orbitcache.com/engine/hls2/01/09140/gc5lpxuqgrak_,n,.urlset/master.m3u8?t=F3z4Vr5gayxRKGOuvX39UtLtNdP04WDOIWHHfr0P6MQ&s=1741878671&e=14400&f=45704535&node=5LpKIhsv95HV1Q3x7jrfRXldwp3y8CT5PdX8aM588gQ=&i=103.123&sp=2500&asn=138296&q=n";
  const source = useMemo(() => {
    if (provider === 'animepahe') {
      const tracks: VideoTrack[] = [];
      data?.sources?.map((track, index) => {
        if (track?.url) {
          tracks.push({
            width: undefined,
            height: Number((track.quality!.match(/(\d{3,4})p/) || [])[1]?.trim() || 0),
            index,
          });
        }
      });
      setVideoTracks(tracks);
      return data?.sources?.[selectedVideoTrackIndex || 0]?.url;
    } else {
      return (
        data?.sources?.find((s) => s.quality === 'default')?.url ||
        data?.sources?.find((s) => s.quality === 'backup')?.url ||
        data?.sources?.find((s) => s.quality === 'auto')?.url ||
        data?.sources?.[0]?.url ||
        (Array.isArray(data) ? data[0]?.sources?.[0]?.url : '') ||
        ''
      );
    }
  }, [data, provider, selectedVideoTrackIndex, setVideoTracks]);
  // console.log(source);
  useEffect(() => {
    if (source && provider !== 'animepahe') {
      const fetchQuality = async () => {
        try {
          const { data } = await axios.get(`${source}`);

          // Extract resolutions using regex
          const regex =
            /^#EXT-X-STREAM-INF:.*?BANDWIDTH=(\d+),RESOLUTION=(\d+)x(\d+)(?:,FRAME-RATE=([\d.]+))?(?:,CODECS="([^"]+)")?/gm;
          const lines = data.split('\n');
          const tracks = [];
          for (const line of lines) {
            const match = regex.exec(line);
            if (match) {
              tracks.push({
                bitrate: parseInt(match[1]),
                width: parseInt(match[2]),
                height: parseInt(match[3]),
                codecs: match[5],
                index: tracks.length,
              });
            }
          }

          console.log('Available qualities:', tracks);
          setVideoTracks(tracks);
        } catch (error) {
          console.error('Failed to fetch quality:', error);
        }
      };
      fetchQuality();
    }
  }, [source]);

  // useEffect(() => {
  //   console.log('Selected quality changed:', {
  //     index: selectedVideoTrackIndex,
  //     quality: videoTracks?.[selectedVideoTrackIndex || 0],
  //   });
  // }, [selectedVideoTrackIndex, videoTracks]);

  const gestures = Gesture.Exclusive(doubleTapGesture, brightnessVolumeGesture);

  useEffect(() => {
    if (data?.subtitles && data?.subtitles?.length > 0) {
      setSubtitleTracks(data?.subtitles);
    }
    console.log('subtitle useeffect');
  }, [data?.subtitles]);

  useEffect(() => {
    if (!isLoading && !isServerLoading && source === '') {
      toast.error('No video source found', { description: 'Try changing servers' });
    }
    if (!isLoading && error && serverError) {
      toast.error('Error', { description: error?.message ?? serverError?.message });
    }
  }, [source, isLoading, error, isServerLoading, serverError]);

  if (isLoading || isServerLoading) {
    return (
      <ThemedView useSafeArea={false}>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$color" />
        </YStack>
      </ThemedView>
    );
  }

  return (
    <ThemedView useSafeArea={false} useStatusBar={isFullscreen}>
      <View height="100%" top={top}>
        <GestureDetector gesture={gestures}>
          <View
            overflow="hidden"
            // height={isVideoReady ? playerDimensions.height : '100%'}
            style={{ aspectRatio: 16 / 9 }}>
            <Pressable
              onPressIn={(e) => {
                if (isDoubleTap) {
                  e.preventDefault();
                  return;
                }
              }}
              onPress={(e) => {
                if (isDoubleTap) {
                  e.preventDefault();
                  return;
                }
                toggleControls();
              }}>
              <View
                style={{ height: playerDimensions.height, position: 'relative' }}
                // style={{height:"100%", position: 'relative' }} //keep for future ref
                onLayout={(e) => {
                  setWrapperDimensions({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });
                }}>
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
                  poster={{ source: { uri: poster }, resizeMode: 'contain' }}
                  onProgress={handleProgress}
                  onPlaybackStateChanged={handlePlaybackStateChange}
                  onLayout={(e) => {
                    setPlayerDimensions({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });
                  }}
                  onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
                  onError={(error) => {
                    toast.error('Video Error', { description: 'Try changing servers' });
                    console.log('Video Error:', error);
                  }}
                  onLoad={(value) => {
                    console.log(getProgress(uniqueId)?.currentTime, 'Video loaded:', value);
                    setIsVideoReady(true);
                    // to find how much of the textTracks have null language and title
                    const nullTrackCount =
                      value.textTracks?.filter((track) => !track.language && !track.title).length || 0;
                    setNullSubtitleIndex(nullTrackCount);
                    console.log('nullIndex:', nullTrackCount);
                    setAudioTracks(value.audioTracks);
                    videoRef?.current?.seek(getProgress(uniqueId)?.currentTime || 0);
                  }}
                  selectedVideoTrack={{ type: SelectedVideoTrackType.INDEX, value: selectedVideoTrackIndex ?? 0 }}
                  selectedTextTrack={{
                    type: SelectedTrackType.INDEX,
                    value: (selectedSubtitleIndex ?? 0) + NullSubtitleIndex!,
                  }}
                  // onVideoTracks={(tracks) => {
                  //   console.log('Video Tracks:', tracks);
                  // }}
                  // onTextTracks={(tracks) => {
                  //   console.log('Text Tracks:', tracks);
                  // }}
                  subtitleStyle={{ paddingBottom: 50, fontSize: 20, opacity: 0.8 }}
                />
                <ControlsOverlay
                  showControls={showControls}
                  routeInfo={{ mediaType, provider, id, type }}
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
                  videoTracks={videoTracks}
                  selectedVideoTrackIndex={selectedVideoTrackIndex}
                  setSelectedVideoTrackIndex={setSelectedVideoTrackIndex}
                  onPlayPress={handlePlayPress}
                  onMutePress={handleMutePress}
                  onFullscreenPress={isFullscreen ? exitFullscreen : enterFullscreen}
                  onSeek={handleSeek}
                />
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
          <YStack flex={1} gap="$2">
            {/* {description && (
            <>
              <Text textAlign="justify" padding="$2">
                {description}
              </Text>
            </>
          )} */}
            {mediaType === MediaType.ANIME && (
              <YStack paddingTop="$2" paddingHorizontal="$2" borderRadius="$4">
                {[{ label: 'Sub', key: 'sub' }, isDubbed === 'true' && { label: 'Dub', key: 'dub' }]
                  // @ts-ignore
                  .map(({ label, key }, index) => (
                    <XStack
                      key={`${key}-${index}`}
                      alignItems="center"
                      justifyContent="space-between"
                      marginBottom="$2">
                      {key && (
                        <Text color="$color1" fontWeight="bold" width={50}>
                          {label}:
                        </Text>
                      )}
                      <XStack flexWrap="wrap" flex={1} gap={4}>
                        {PROVIDERS[mediaType].map(({ name, value, subbed, dubbed }) => {
                          const isAvailable = key === 'sub' ? subbed : key === 'dub' ? dubbed : false;
                          const isSelected = getProvider(mediaType) === value && dub === (key === 'dub');
                          if (!isAvailable) return null;
                          return (
                            <Button
                              key={value}
                              onPress={() => {
                                setDub(key === 'dub');
                                setProvider(mediaType, value);
                              }}
                              backgroundColor={isSelected ? '$color' : '$color3'}
                              flex={1}
                              minWidth={150}
                              justifyContent="center">
                              <XStack alignItems="center">
                                {isSelected && <Check color="$color4" />}
                                <Text fontWeight={900} color={isSelected ? '$color4' : '$color'}>
                                  {name}
                                </Text>
                              </XStack>
                            </Button>
                          );
                        })}
                      </XStack>
                    </XStack>
                  ))}
              </YStack>
            )}

            {mediaType === MediaType.MOVIE && (
              <YStack paddingTop="$2" paddingHorizontal="$2" borderRadius="$4">
                {[
                  { label: 'Embed', key: 'embed' },
                  { label: 'Direct', key: 'nonEmbed' },
                ].map(({ label, key }) => (
                  <XStack key={key} alignItems="center" justifyContent="space-between" marginBottom="$2">
                    <Text color="$color1" fontWeight="bold" width={70}>
                      {label}:
                    </Text>
                    <XStack flexWrap="wrap" flex={1} gap={4}>
                      {PROVIDERS[mediaType].map(({ name, value, embed, nonEmbed }) => {
                        const isAvailable = key === 'embed' ? embed : key === 'nonEmbed' ? nonEmbed : false;
                        const isSelected =
                          getProvider(mediaType) === value &&
                          ((key === 'embed' && isEmbed) || (key === 'nonEmbed' && !isEmbed));
                        // console.log('isEmbed:', isEmbed, isSelected);

                        if (!isAvailable) return null;

                        return (
                          <Button
                            key={`${value}-${key}`}
                            onPress={() => {
                              setProvider(mediaType, value);
                              setIsEmbed(key === 'embed');
                            }}
                            backgroundColor={isSelected ? '$color' : '$color3'}
                            flex={1}
                            justifyContent="center">
                            <XStack alignItems="center">
                              {isSelected && <Check color="$color4" />}
                              <Text fontWeight={900} color={isSelected ? '$color4' : '$color'}>
                                {name}
                              </Text>
                            </XStack>
                          </Button>
                        );
                      })}
                    </XStack>
                  </XStack>
                ))}
              </YStack>
            )}
            <View flex={1}>
              <EpisodeList mediaType={mediaType} provider={provider} id={id} type={type} swipeable={false} />
            </View>
          </YStack>
        )}
      </View>
    </ThemedView>
  );
};

export default Watch;

// const styles = StyleSheet.create({
//   centerOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     pointerEvents: 'none',
//   },
//   forwardIndicator: {
//     position: 'absolute',
//     right: '25%',
//     top: '50%',
//     transform: [{ translateY: -25 }], // Center the element by offsetting half its height
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     padding: 15,
//     borderRadius: 40,
//   },
//   backwardIndicator: {
//     position: 'absolute',
//     left: '25%',
//     top: '50%',
//     transform: [{ translateY: -25 }], // Center the element by offsetting half its height
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     padding: 15,
//     borderRadius: 40,
//   },
//   seekText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
