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
} from "@tamagui/lucide-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams } from "expo-router";
import { useWatchAnimeEpisodes } from "@/queries/watchQueries";
import { ThemedView } from "@/components/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
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

  const handleFullscreenToggle = async () => {
    try {
      if (!isFullscreen && videoRef.current) {
        videoRef.current.presentFullscreenPlayer();
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        setIsFullscreen(true);
      } else {
        if (videoRef.current) {
          videoRef.current.dismissFullscreenPlayer();
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
          setIsFullscreen(false);
        }
      }
    } catch (error) {
      console.error("Failed to toggle fullscreen:", error);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShowControls(!showControls);
          console.log("pressed");
        }}
        style={[
          { flex: 1 },
          isFullscreen && {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
          },
        ]}
      >
        <View
          height="100%"
          position="relative"
          backgroundColor={"white"}
        >
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
            onFullscreenPlayerWillPresent={() => handleFullscreenToggle()}
            onFullscreenPlayerWillDismiss={() => handleFullscreenToggle()}
            paused={!isPlaying}
            muted={isMuted}
            controls={false}
            onError={(error) => console.log("Video Error:", error)}
          />

        {showControls && (
          <XStack
          position="absolute"
          top={0}
          left={0}
            right={0}
            backgroundColor="$color"
            paddingVertical="$4"
            paddingHorizontal="$4"
            justifyContent="space-between"
            opacity={0.5}
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
              icon={Fullscreen}
              size="$4"
              circular
              onPress={(e) => {
                e.stopPropagation();
                videoRef.current?.presentFullscreenPlayer();
              }}
              />
          </XStack>
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
    <ThemedView>
      <VideoPlayer source={source} />
    </ThemedView>
  );
};

export default Watch;
