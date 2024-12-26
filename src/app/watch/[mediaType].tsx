import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { YStack, XStack, Button, Spinner, Text, View } from "tamagui";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Fullscreen,
} from "@tamagui/lucide-icons";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { useWatchAnimeEpisodes } from "@/queries/watchQueries";
import * as ScreenOrientation from "expo-screen-orientation";

interface VideoPlayerProps {
  source: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
  });

  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      ).catch((error) => console.error("Failed to reset orientation:", error));
    };
  }, []);
  const handleFullscreenChange = async (entering: boolean) => {
    try {
      // Lock orientation before state update
      await ScreenOrientation.lockAsync(
        entering
          ? ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
          : ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      
      // Update state after orientation lock
      setIsFullscreen(entering);
    } catch (error) {
      console.error("Failed to change orientation:", error);
    }
  };

  const handleOrientationChange = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();
    const isLandscape =
      orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
      orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

    if (isLandscape !== isFullscreen) {
      if (!isLandscape) {
        // Exit fullscreen when device is rotated to portrait
        // @ts-ignore
        videoRef.current?.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    // Lock initial orientation to portrait
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    const subscription = ScreenOrientation.addOrientationChangeListener(
      handleOrientationChange
    );

    return () => {
      subscription.remove();
      // Reset to portrait on unmount
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <YStack flex={1}>
      <View backgroundColor="$background" flex={1}>
        <VideoView
          ref={videoRef}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          style={[
            styles.video,
            isFullscreen && { aspectRatio: undefined, height: '100%' }
          ]}
          onFullscreenEnter={() => handleFullscreenChange(true)}
          onFullscreenExit={() => handleFullscreenChange(false)}
        />

        <XStack
          paddingVertical="$4"
          paddingHorizontal="$4"
          justifyContent="space-between"
          alignItems="center"
          backgroundColor="$background"
        >
          <Button
            icon={isPlaying ? Pause : Play}
            size="$4"
            circular
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          />

          <Button
            icon={player.muted ? VolumeX : Volume2}
            size="$4"
            circular
            onPress={() => {
              player.muted = !player.muted;
            }}
          />

          <Button
            icon={Fullscreen}
            size="$4"
            circular
            onPress={() => {
              // @ts-ignore
              videoRef.current?.enterFullscreen();
            }}
          />
        </XStack>
      </View>
    </YStack>
  );
};

const styles = StyleSheet.create({
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
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
  console.log(data, "data");
  const [source, setSource] = useState<string>(
    data?.sources?.find((s) => s.quality === "default")?.url ||
      data?.sources?.find((s) => s.quality === "backup")?.url ||
      ""
  );
  console.log(source, "source");
  if (isLoading) {
    return (
      <ThemedView>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner />
        </YStack>
      </ThemedView>
    );
  }
  return (
    <ThemedView>
      <YStack flex={1}>
        <VideoPlayer
          source={
            source ||
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          }
        />
      </YStack>
    </ThemedView>
  );
};

export default Watch;
