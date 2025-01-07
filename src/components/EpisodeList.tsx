import { View, Text, YStack, XStack, Spinner, useTheme } from 'tamagui';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import React, { Suspense, useRef } from 'react';
import CustomImage from '@/components/CustomImage';
import { useAnimeEpisodes } from '@/hooks/queries';
import { useLocalSearchParams, Link, useRouter } from 'expo-router';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Captions, Eye, EyeOff, Mic } from '@tamagui/lucide-icons';
import { useCurrentPlayingEpisode } from '@/hooks/stores/useCurrentPlayingEpisode';
import WavyAnimation from './WavyAnimation';

const LoadingState = () => (
  <YStack justifyContent="center" alignItems="center" minHeight={300}>
    <Spinner size="large" color="$color" />
  </YStack>
);

const EpisodeList = ({
  mediaType,
  provider,
  id,
  swipeable = false,
}: {
  mediaType: string;
  provider: string;
  id: string;
  swipeable?: boolean;
}) => {
  const swipeRef = useRef<SwipeableMethods>(null);
  const router = useRouter();
  const theme = useTheme();
  const currentPlayingEpisode = useCurrentPlayingEpisode((state) => state.currentPlayingEpisode);

  const rightActions = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const THRESHOLD = 100;

    const animatedStyle = useAnimatedStyle(() => {
      const progress = Math.min(Math.abs(drag.value) / THRESHOLD, 1);
      return {
        transform: [
          {
            scale: withSpring(0.9 + progress * 0.1, {
              mass: 0.5,
              damping: 20,
              stiffness: 200,
            }),
          },
        ],
        opacity: withSpring(progress > 0 ? 1 : 0.7),
      };
    });

    const eyeIconStyle = useAnimatedStyle(() => {
      const progress = Math.min(Math.abs(drag.value) / THRESHOLD, 1);

      // Interpolate icon opacity based on progress
      const opacity = interpolate(progress, [0.5, 1], [1, 0], Extrapolation.CLAMP);

      return { opacity };
    });

    const eyeOffIconStyle = useAnimatedStyle(() => {
      const progress = Math.min(Math.abs(drag.value) / THRESHOLD, 1);

      const opacity = interpolate(progress, [0.5, 1], [0, 1], Extrapolation.CLAMP);

      return { opacity };
    });

    return (
      <Animated.View
        style={[
          animatedStyle,
          { width: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: theme?.color4?.val },
        ]}
      >
        <Animated.View
          style={[{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }, eyeIconStyle]}
        >
          <Eye color="white" size={24} />
        </Animated.View>

        <Animated.View
          style={[
            { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
            eyeOffIconStyle,
          ]}
        >
          <EyeOff color="white" size={24} />
        </Animated.View>
      </Animated.View>
    );
  };

  const renderPressableItem = ({ item }: { item: any }) => {
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/watch/[mediaType]',
            params: {
              mediaType,
              provider,
              id,
              episodeId: item?.id,
              episodeDubId: item?.dubId,
              isDub: item?.isDub,
              poster: item?.image,
              title: item?.title,
              description: item?.description,
              number: item?.number,
            },
          })
        }
      >
        <YStack
          gap={'$4'}
          padding={2}
          borderWidth={1}
          borderColor={currentPlayingEpisode === item.id ? '$color4' : '$background'}
          backgroundColor="$background"
        >
          <XStack gap={'$4'}>
            <View position="relative">
              <CustomImage source={item?.image} style={{ width: 160, height: 107, bordeRadius: 4 }} />
              <View
                position="absolute"
                bottom="$1"
                left="$1"
                backgroundColor="$background"
                opacity={0.8}
                borderRadius="$4"
                paddingHorizontal="$2"
                paddingVertical="$1"
              >
                <Text fontSize="$3" fontWeight="700" color="$color">
                  EP {item.number}
                </Text>
              </View>
            </View>
            <YStack padding={2} flex={1}>
              <XStack alignItems="center" justifyContent="space-between" gap={2}>
                <Text fontSize="$3" fontWeight="700" numberOfLines={2} flex={1}>
                  {item.title}
                </Text>
                <XStack gap={2}>
                  <Captions size={20} color="$color2" />
                  {item?.isDub && <Mic size={20} color="$color2" />}
                </XStack>
              </XStack>
              <Text fontSize="$2.5" color="$color2" fontWeight="500" numberOfLines={3}>
                {item?.description}
              </Text>

              <XStack justifyContent="space-between" alignItems="center">
                {currentPlayingEpisode === item?.id ? <WavyAnimation /> : null}
                <Text fontSize="$2.5" fontWeight="500" color="$color2">
                  {new Date(item.airDate).toDateString()}
                </Text>
              </XStack>
            </YStack>
          </XStack>
        </YStack>
      </Pressable>
    );
  };
  const { data: episodeData, isLoading } = useAnimeEpisodes({ id, provider });
  // console.log('ep', episodeData);
  const episodesList = Array.isArray(episodeData) ? episodeData : [];
  if (isLoading) {
    return <LoadingState />;
  }
  return (
    <YStack gap={2}>
      <FlatList
        data={episodesList || []}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
        ListFooterComponent={<View height={100} />}
        showsVerticalScrollIndicator={true}
        keyExtractor={(item) => item.id.toString()} //just to be sure :)
        renderItem={({ item }) =>
          swipeable ? (
            <ReanimatedSwipeable
              ref={swipeRef}
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
              onSwipeableOpen={(_: any, s: any) => s.close()}
              onSwipeableWillOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              onSwipeableWillClose={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              renderRightActions={rightActions}
            >
              {renderPressableItem({ item })}
            </ReanimatedSwipeable>
          ) : (
            renderPressableItem({ item })
          )
        }
      />
    </YStack>
  );
};

export default EpisodeList;
