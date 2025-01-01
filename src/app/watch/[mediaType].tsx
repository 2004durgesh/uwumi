import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Dimensions,
  DimensionValue,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Video, { ISO639_1, SelectedTrackType, TextTrackType, type VideoRef } from 'react-native-video';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { YStack, View, Spinner, Text } from 'tamagui';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useLocalSearchParams } from 'expo-router';
import { useWatchAnimeEpisodes } from '@/queries/watchQueries';
import { ThemedView } from '@/components/ThemedView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlsOverlay from './ControlsOverlay';
import { ISubtitle } from '@/constants/types';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';

interface VideoPlayerProps {
  source: string;
  subtitles?: ISubtitle[];
  episodeInfo: {
    mediaType: string;
    provider: string;
    episodeId: string;
    episodeDubId: string;
    isDub: string;
    poster: string;
    title: string;
    description: string;
  };
}

export interface SubtitleTrack {
  index: number;
  title?: string;
  language?: string;
  type?: WithDefault<'srt' | 'ttml' | 'vtt' | 'application/x-media-cues', 'srt'>;
  selected?: boolean;
  uri: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source, episodeInfo, subtitles }) => {
  const { top } = useSafeAreaInsets();
  const { mediaType, provider, episodeId, episodeDubId, isDub, poster, title, description } = episodeInfo;
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekableDuration, setSeekableDuration] = useState(0);
  // const [isVideoReady, setIsVideoReady] = useState(false);
  const [playerDimensions, setPlayerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  const [subtitleTracks, setSubtitleTracks] = useState<ISubtitle[] | undefined>([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState<number | undefined>(0);
  console.log(subtitleTracks, selectedSubtitle);
  useEffect(() => {
    if (subtitles) {
      setSubtitleTracks(subtitles);
    }
  }, [subtitles]);

  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
  });
  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });
  const { muted } = useEvent(player, 'mutedChange', { muted: player.muted });
  const { subtitleTrack } = useEvent(player, 'subtitleTrackChange', { subtitleTrack: player.subtitleTrack });

  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  // useEffect(() => {
  //   const hideControls = () => {
  //     if (isPlaying && showControls) {
  //       controlsTimeoutRef.current = setTimeout(() => {
  //         setShowControls(false);
  //       }, 3000);
  //     }
  //   };

  //   // Clear any existing timeout before setting a new one
  //   if (controlsTimeoutRef.current) {
  //     clearTimeout(controlsTimeoutRef.current);
  //   }

  //   hideControls();

  //   return () => {
  //     if (controlsTimeoutRef.current) {
  //       clearTimeout(controlsTimeoutRef.current);
  //     }
  //   };
  // }, [showControls, isPlaying]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => {
      subscription?.remove();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(console.error);
      SystemNavigationBar.navigationShow();
      setIsFullscreen(false);
    };
  }, []);

  const enterFullscreen = async () => {
    try {
      if (videoRef.current) {
        SystemNavigationBar.stickyImmersive();
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (videoRef.current) {
        SystemNavigationBar.navigationShow();
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  const handleProgress = ({ currentTime, seekableDuration }: { currentTime: number; seekableDuration: number }) => {
    setCurrentTime(currentTime);
    setSeekableDuration(seekableDuration);
  };

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
    [isFullscreen, dimensions, top]
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShowControls(!showControls);
          console.log('pressed', playerDimensions, dimensions);
        }}
        style={{ backgroundColor: 'red', flex: 1 }}
      >
        <View height={playerDimensions.height} position="relative">
          <VideoView
            ref={videoRef}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls={false}
            style={videoStyle}
            contentFit={'contain'}
            onFullscreenEnter={() => enterFullscreen()}
            onFullscreenExit={() => exitFullscreen()}
            onLayout={(e) => {
              setPlayerDimensions({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
              });
            }}
          />
          <ControlsOverlay
            showControls={showControls}
            isPlaying={isPlaying}
            isMuted={muted}
            isFullscreen={isFullscreen}
            currentTime={currentTime}
            seekableDuration={seekableDuration}
            title={title}
            subtitleTracks={subtitleTracks}
            selectedSubtitle={selectedSubtitle}
            setSelectedSubtitle={setSelectedSubtitle}
            onPlayPress={() => (isPlaying ? player.pause() : player.play())}
            onMutePress={() => (player.muted = !muted)}
            onFullscreenPress={isFullscreen ? exitFullscreen : enterFullscreen}
            onSeek={(value) => {
              player.seekBy(value);
              setCurrentTime(value);
            }}
          />
        </View>
      </TouchableOpacity>
      <Text>{description}</Text>
    </>
  );
};

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
  console.log(data);
  const source = useMemo(
    () =>
      data?.sources?.find((s) => s.quality === 'default')?.url ||
      data?.sources?.find((s) => s.quality === 'backup')?.url ||
      data?.sources?.[0]?.url ||
      '',
    [data?.sources]
  );
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
    <ThemedView>
      <VideoPlayer
        source={source}
        subtitles={data?.subtitles}
        episodeInfo={{ mediaType, provider, episodeId, episodeDubId, isDub, poster, title, description }}
      />
    </ThemedView>
  );
};

export default Watch;
