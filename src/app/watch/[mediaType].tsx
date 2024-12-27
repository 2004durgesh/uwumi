import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  YStack,
  XStack,
  Button,
  View,
  Spinner,
  ScrollView,
  ZStack,
  Text,
} from "tamagui";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Fullscreen,
  VolumeOff,
} from "@tamagui/lucide-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams } from "expo-router";
import { useWatchAnimeEpisodes } from "@/queries/watchQueries";
import { ThemedView } from "@/components/ThemedView";

interface VideoPlayerProps {
  source: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
  });

  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playerDimensions, setPlayerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const { muted } = useEvent(player, "mutedChange", { muted: player.muted });

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener(
      ({ orientationInfo }) => {
        if (!isFullscreen) {
          ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
        }
      }
    );

    return () => {
      subscription.remove();
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, [isFullscreen]);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const handleFullscreenChange = async (entering: boolean) => {
    try {
      if (entering) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
        );
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }
    } catch (error) {
      console.error(
        `Failed to ${entering ? "enter" : "exit"} fullscreen:`,
        error
      );
    }
  };

  const toggleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (isFullscreen) {
        // @ts-expect-error: Method exists but types are missing
        await videoRef.current.exitFullscreen();
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
        );
        // @ts-expect-error: Method exists but types are missing
        await videoRef.current.enterFullscreen();
      }
    } catch (error) {
      console.error("Failed to toggle fullscreen:", error);
    }
  };

  return (
    <YStack flex={1}>
      <View backgroundColor="$color" flex={1}>
        <TouchableOpacity
          style={[StyleSheet.absoluteFill,{backgroundColor: "red"}]}
          onPress={() => setShowControls(!showControls)}
        >
          <View position="relative" width="100%" height={playerDimensions.height}>
            <VideoView
              ref={videoRef}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
              nativeControls={false}
              style={[styles.video, isFullscreen && { height: "100%" }]}
              onFullscreenEnter={() => handleFullscreenChange(true)}
              onFullscreenExit={() => handleFullscreenChange(false)}
              pointerEvents="auto"
              onLayout={(e) => {const { width, height } = e.nativeEvent.layout;
                setPlayerDimensions({ width, height });}}
            />

            {showControls && (
              <XStack
                position="absolute"
                top="0"
                left="0"
                right="0"
                paddingVertical="$4"
                paddingHorizontal="$4"
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  icon={isPlaying ? Pause : Play}
                  size="$4"
                  circular
                  onPress={(e) => {
                    e.stopPropagation();
                    if (isPlaying) {
                      player.pause();
                    } else {
                      player.play();
                    }
                  }}
                />

                <Button
                  icon={muted ? VolumeOff : Volume2}
                  size="$4"
                  circular
                  onPress={(e) => {
                    e.stopPropagation();
                    player.muted = !player.muted;
                  }}
                />

                <Button
                  icon={Fullscreen}
                  size="$4"
                  circular
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                />
              </XStack>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </YStack>
  );
};

const styles = StyleSheet.create({
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
  },
});

const Watch = () => {
  const {
    mediaType,
    provider,
    episodeId,
    episodeDubId,
    isDub,
    poster,
    title,
    description,
  } = useLocalSearchParams<{
    mediaType: string;
    provider: string;
    episodeId: string;
    episodeDubId: string;
    isDub: string;
    poster: string;
    title: string;
    description: string;
  }>();
  console.log({
    mediaType,
    provider,
    episodeId,
    episodeDubId,
    isDub,
    poster,
    title,
    description,
  });
  const { data, isLoading, error } = useWatchAnimeEpisodes({
    episodeId,
    provider,
  });
  const [source, setSource] = useState<string>(
    data?.sources?.find((s) => s.quality === "default")?.url ||
      data?.sources?.find((s) => s.quality === "backup")?.url ||
      ""
  );
  useEffect(() => {
    if (data?.sources) {
      const defaultSource =
        data.sources.find((s) => s.quality === "default")?.url ||
        data.sources.find((s) => s.quality === "backup")?.url;
      setSource(defaultSource || "");
    }
  }, [data]);
  if (isLoading) {
    return (
      <ThemedView useSafeArea={false}>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner />
        </YStack>
      </ThemedView>
    );
  }
  return (
    <ThemedView>
      <VideoPlayer source={source} />
    </ThemedView>
  );
};

export default Watch;
