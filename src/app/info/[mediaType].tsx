import AnimatedCountdown from '@/components/AnimatedCountdown';
import { AnimatedCustomImage } from '@/components/CustomImage';
import IconTitle from '@/components/IconTitle';
import { ThemedView } from '@/components/ThemedView';
import { useCurrentTheme, useInfo, usePureBlackBackground } from '@/hooks';
import { ArrowLeft, Clock, Star } from '@tamagui/lucide-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spinner, Text, View, XStack, YStack, ZStack } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import HorizontalTabs from '@/components/HorizontalTabs';
import { MediaType, MetaProvider } from '@/constants/types';
import { hexToRGB } from '@/constants/utils';
import Episodes from './Episodes';
import Chapters from './Chapters';
import Details from './Details';
import Similar from './Similar';
import AnimatedFavoriteButton from '@/components/AnimatedFavoriteButton';
import RippleButton from '@/components/RippleButton';
import { MediaFormat, TvType } from 'react-native-consumet';
import { useProviderStore } from '@/constants/provider';

const Info = () => {
  const { mediaType, metaProvider, type, provider, id, image } = useLocalSearchParams<{
    mediaType: MediaType;
    metaProvider: MetaProvider;
    type: MediaFormat | TvType;
    provider: string;
    id: string;
    image: string;
  }>();
  const { getProvider } = useProviderStore();
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useInfo({ mediaType, id, metaProvider, type, provider: getProvider(mediaType) });
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const currentTheme = useCurrentTheme();
  const router = useRouter();

  const tabItems = [
    {
      key: 'tab1',
      label: mediaType === MediaType.MANGA ? 'Chapters' : 'Episodes',
      content: mediaType === MediaType.MANGA ? <Chapters /> : <Episodes />,
    },
    {
      key: 'tab2',
      label: 'Details',
      content: <Details data={data} />,
    },
    {
      key: 'tab3',
      label: 'Similar',
      content: <Similar data={data} mediaType={mediaType} metaProvider={metaProvider} />,
    },
  ];
  // console.log(data);
  if (isLoading) {
    return (
      <ThemedView>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$color" />
        </YStack>
      </ThemedView>
    );
  }
  return (
    <>
      <ThemedView useSafeArea statusBarProps={{ translucent: true, backgroundColor: 'transparent' }}>
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
          <View padding={10} marginTop={insets.top}>
            <XStack alignItems="center" justifyContent="space-between" marginBlockEnd={20}>
              {/* a small delay to ensure the back navigation is smooth  */}
              <RippleButton onPress={() => setTimeout(() => router.back(), 300)}>
                <ArrowLeft />
              </RippleButton>

              <AnimatedFavoriteButton
                id={id}
                title={data?.title!}
                image={image || data?.image!}
                type={type}
                mediaType={mediaType}
                provider={provider}
                metaProvider={metaProvider}
              />
            </XStack>

            <XStack gap={10} alignItems="center">
              <AnimatedCustomImage
                sharedTransitionTag="shared-image"
                source={{ uri: image }}
                style={{ width: 115, height: 163 }}
              />
              <YStack gap={8} flex={1}>
                <Text numberOfLines={3} color="$color1" fontSize="$5" fontWeight="700">
                  {typeof data?.title === 'object' ? data?.title?.english || data?.title?.romaji : data?.title}
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
              <XStack>
                <Text>Webview</Text>
              </XStack>
            </View>
          </View>
        </ZStack>

        <YStack alignItems="center" marginTop={20} flex={1}>
          <HorizontalTabs items={tabItems} initialTab="tab1" />
        </YStack>
      </ThemedView>
    </>
  );
};

export default Info;
