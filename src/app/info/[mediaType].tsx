import {
  View,
  Text,
  ZStack,
  XStack,
  YStack,
} from "tamagui";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { useAnimeInfo } from "@/queries";
import { ImageBackground, StyleSheet } from "react-native";
import {
  ArrowLeft,
  Captions,
  CaptionsOff,
  Clock,
  Heart,
  Star,
} from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";
import HorizontalTabs from "./HorizontalTabs";
import { BlurView } from "expo-blur";
import IconTitle from "@/components/IconTitle";
import CustomImage, { AnimatedCustomImage } from "@/components/CustomImage";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Info = () => {
  const { mediaType, provider, id,image } = useLocalSearchParams<{
    mediaType: string;
    provider: string;
    id: string;
    image: string;
  }>();
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useAnimeInfo({ id, provider });
  console.log(data);
  return (
    <>
      <ThemedView useSafeArea={false}>
        <ZStack height={300}>
          <ImageBackground
            source={{ uri: data?.cover }}
            style={{ width: "100%", height: 300 }}
          />
          <BlurView
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
            intensity={20}
            tint="dark"
          />
          <View height={300}>
            <LinearGradient
              width="100%"
              height="300"
              colors={[
                'rgba(0,0,0,1)',      // Completely black at bottom
                'rgba(0,0,0,0.7)',    // Darker in middle
                'rgba(0,0,0,0.4)',    // Lighter at top
              ]}
              start={[0, 1]}
              end={[0, 0.5]}
              flex={1}
            />
          </View>
          <View padding={10} marginTop={insets.top+10}>
            <XStack justifyContent="space-between" marginBlockEnd={20}>
              <ArrowLeft />
              <Heart />
            </XStack>

            <XStack gap={10} alignItems="center">
              <AnimatedCustomImage sharedTransitionTag="shared-image" source={{uri:image}} style={{width:115,height:163}}/>
              <YStack paddingHorizontal={20} gap={8} flex={1}>
                <Text color="$color1" fontWeight='700'>{typeof data?.title === 'object' ? data?.title?.english : data?.title}</Text>
                <IconTitle icon={Clock} text={data?.status} />

                <XStack justifyContent="space-between">
                  <IconTitle icon={Star} text={data?.rating} />
                  <IconTitle
                    icon={data?.subOrDub === "sub" ? Captions : CaptionsOff}
                    text={data?.subOrDub}
                  />
                  <IconTitle text={data?.type} />
                </XStack>
                <Text color="$color1">
                  {new Date(
                    data?.nextAiringEpisode?.airingTime * 1000
                  ).toDateString()}
                </Text>
              </YStack>
            </XStack>
            <View marginTop={20}>
              <Text>Webview</Text>
            </View>
          </View>
        </ZStack>

        <YStack alignItems="center" marginTop={20} flex={1}>
          {data && <HorizontalTabs data={data} />}
        </YStack>
      </ThemedView>
    </>
  );
};

export default Info;
