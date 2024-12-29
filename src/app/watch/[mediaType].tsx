import React, { useEffect, useRef, useState } from "react";
import {
  DimensionValue,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Video, { type VideoRef } from "react-native-video";
import { YStack, XStack, Button, View, Spinner, ZStack } from "tamagui";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Fullscreen,
  VolumeOff,
  Maximize,
  Minimize,
} from "@tamagui/lucide-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams } from "expo-router";
import { useWatchAnimeEpisodes } from "@/queries/watchQueries";
import { ThemedView } from "@/components/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut,Easing} from "react-native-reanimated";

interface VideoPlayerProps {
  source: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const { top } = useSafeAreaInsets();
  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playerDimensions, setPlayerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const AnimatedView = Animated.createAnimatedComponent(View);

  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    const hideControls = () => {
      if (isPlaying && showControls) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    // Clear any existing timeout before setting a new one
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    hideControls();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const enterFullscreen = async () => {
    try {
      if (videoRef.current) {
        videoRef.current.setFullScreen(true);
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (videoRef.current) {
        videoRef.current.setFullScreen(false);
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShowControls(!showControls);
          console.log("pressed", playerDimensions);
        }}
      >
        <View height={playerDimensions.height} position="relative">
          <Video
            ref={videoRef}
            source={{ uri: source }}
            style={{
              width: "100%",
              aspectRatio: 16 / 9,
              backgroundColor: "red",
              position: "absolute",
              top: top,
              left: 0,
              right: 0,
            }}
            resizeMode="contain"
            onFullscreenPlayerWillPresent={() => enterFullscreen()}
            onFullscreenPlayerWillDismiss={() => exitFullscreen()}
            paused={!isPlaying}
            muted={isMuted}
            controls={false}
            onLayout={(e) => {
              setPlayerDimensions({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
              });
            }}
            onError={(error) => console.log("Video Error:", error)}
          />

          {showControls && (
            <AnimatedView
              height={playerDimensions.height}
              backgroundColor="rgba(0,0,0,0.5)"
              top={top}
              left={0}
              right={0}
              entering={FadeIn.duration(300).easing(
                Easing.bezierFn(0.25, 0.1, 0.25, 1)
              )}
              exiting={FadeOut.duration(100).easing(Easing.out(Easing.ease))}
            >
              <XStack
                position="absolute"
                top={top}
                left={0}
                right={0}
                paddingHorizontal="$4"
                justifyContent="space-between"
                alignItems="center"
                zIndex={10000}
              >
                <Button
                  icon={isPlaying ? Pause : Play}
                  size="$4"
                  circular
                  onPress={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                />
                <Button
                  icon={isMuted ? VolumeOff : Volume2}
                  size="$4"
                  circular
                  onPress={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                />
                <Button
                  icon={Maximize}
                  size="$4"
                  circular
                  onPress={(e) => {
                    e.stopPropagation();
                    enterFullscreen();
                  }}
                />
                <Button
                  icon={Minimize}
                  size="$4"
                  circular
                  onPress={(e) => {
                    e.stopPropagation();
                    exitFullscreen();
                  }}
                />
              </XStack>
            </AnimatedView>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

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
  // console.log({
  //   mediaType,
  //   provider,
  //   episodeId,
  //   episodeDubId,
  //   isDub,
  //   poster,
  //   title,
  //   description,
  // });
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
    <ThemedView useSafeArea={false}>
      <VideoPlayer source={source} />
    </ThemedView>
  );
};

export default Watch;
