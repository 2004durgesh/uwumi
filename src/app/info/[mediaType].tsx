import AnimatedCountdown from '@/components/AnimatedCountdown';
import { AnimatedCustomImage } from '@/components/CustomImage';
import IconTitle from '@/components/IconTitle';
import { ThemedView } from '@/components/ThemedView';
import { useCurrentTheme, useInfo, usePureBlackBackground } from '@/hooks';
import { ArrowLeft, Clock, Heart, Star } from '@tamagui/lucide-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View, XStack, YStack, ZStack } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import HorizontalTabs from '@/components/HorizontalTabs';
import { IMangaChapter, IMovieSeason, MediaFormat, MediaType, MetaProvider, TvType } from '@/constants/types';
import { hexToRGB } from '@/constants/utils';
import Episodes from './Episodes';
import Chapters from './Chapters';
import Details from './Details';
import Similar from './Similar';

const Info = () => {
  const { mediaType, metaProvider, type, provider, id, image } = useLocalSearchParams<{
    mediaType: MediaType;
    metaProvider: MetaProvider;
    type: MediaFormat | TvType;
    provider: string;
    id: string;
    image: string;
  }>();
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useInfo({ mediaType, id, metaProvider, type, provider });

  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const currentTheme = useCurrentTheme();
  const tabItems = [
    {
      key: 'tab1',
      label: mediaType === MediaType.MANGA ? 'Chapters' : 'Episodes',
      content: mediaType === MediaType.MANGA ? <Chapters data={data?.chapters as IMangaChapter[]} /> : <Episodes />,
    },
    {
      key: 'tab2',
      label: 'Details',
      content: <Details data={data} />,
    },
    {
      key: 'tab3',
      label: 'Similar',
      content: <Similar data={data} />,
    },
  ];
  // console.log(data);
  return (
    <>
      <ThemedView useSafeArea={false} statusBarProps={{ translucent: true, backgroundColor: 'transparent' }}>
        <ZStack height={300}>
          <ImageBackground source={{ uri: data?.cover }} style={{ width: '100%', height: 300 }} />
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
              colors={
                pureBlackBackground
                  ? [hexToRGB('#000000', 1), hexToRGB('#000000', 0.7), hexToRGB('#000000', 0.4)]
                  : [
                      hexToRGB(currentTheme?.background, 1),
                      hexToRGB(currentTheme?.background, 0.7),
                      hexToRGB(currentTheme?.background, 0.4),
                    ]
              }
              start={[0, 1]}
              end={[0, 0.5]}
              flex={1}
            />
          </View>
          <View padding={10} marginTop={insets.top + 10}>
            <XStack justifyContent="space-between" marginBlockEnd={20}>
              <ArrowLeft />
              <Heart />
            </XStack>

            <XStack gap={10} alignItems="center">
              <AnimatedCustomImage
                sharedTransitionTag="shared-image"
                source={{ uri: image }}
                style={{ width: 115, height: 163 }}
              />
              <YStack gap={8} flex={1}>
                <Text numberOfLines={3} color="$color1" fontSize="$5" fontWeight="700">
                  {typeof data?.title === 'object' ? data?.title?.english : data?.title}
                </Text>

                <IconTitle icon={Clock} text={data?.status} />

                <XStack justifyContent="space-between">
                  <IconTitle icon={Star} text={data?.rating} />
                  {data?.nextAiringEpisode?.airingTime && (
                    <AnimatedCountdown targetDate={data.nextAiringEpisode.airingTime} />
                  )}
                  <IconTitle text={data?.type} />
                </XStack>
              </YStack>
            </XStack>
            <View marginTop={20}>
              <Text>Webview</Text>
            </View>
          </View>
        </ZStack>

        <YStack alignItems="center" marginTop={20} flex={1}>
          {data && <HorizontalTabs items={tabItems} initialTab="tab1" />}
        </YStack>
      </ThemedView>
    </>
  );
};

export default Info;
