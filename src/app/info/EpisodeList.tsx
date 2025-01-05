import { View, Text, YStack, XStack, Spinner,useTheme } from 'tamagui';
import { FlatList, Pressable,StyleSheet } from 'react-native';
import React, { Suspense, useRef } from 'react';
import CustomImage from '@/components/CustomImage';
import { useAnimeEpisodes } from '@/queries';
import { useLocalSearchParams, Link, useRouter } from 'expo-router';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Eye, EyeOff, Trash } from '@tamagui/lucide-icons';

const LoadingState = () => (
  <YStack justifyContent="center" alignItems="center" minHeight={300}>
    <Spinner size="large" color="$color" />
  </YStack>
);

const rightActions = (prog: SharedValue<number>, drag: SharedValue<number>) => {
  const theme=useTheme();
  const hasReachedThresholdUp = useSharedValue(false);
  const hasReachedThresholdDown = useSharedValue(false);
  const lastDragValue = useSharedValue(0);
  const THRESHOLD = 100;
  const BUFFER = 5; // Buffer zone to prevent edge cases

  // useAnimatedReaction(
  //   () => {
  //     return drag.value;
  //   },
  //   (dragValue) => {
  //     const absValue = Math.abs(dragValue);
  //     const isMovingOut = Math.abs(dragValue) > Math.abs(lastDragValue.value);
  //     lastDragValue.value = dragValue;

  //     if (absValue >= THRESHOLD + BUFFER && !hasReachedThresholdUp.value && isMovingOut) {
  //       hasReachedThresholdUp.value = true;
  //       hasReachedThresholdDown.value = false;
  //     } else if (absValue <= THRESHOLD - BUFFER && hasReachedThresholdUp.value && !isMovingOut) {
  //       hasReachedThresholdDown.value = true;
  //       hasReachedThresholdUp.value = false;
  //     }
  //   }
  // );

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
    const opacity = interpolate(
      progress,
      [0.5, 1],
      [1, 0],
      Extrapolation.CLAMP
    );
    
    return { opacity };
  });
  
  const eyeOffIconStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(drag.value) / THRESHOLD, 1);
    
    const opacity = interpolate(
      progress,
      [0.5, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    
    return { opacity };
  });

  return (
    <Animated.View style={[animatedStyle, { width: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: theme?.color4?.val }]}>
      <Animated.View style={[{...StyleSheet.absoluteFillObject,justifyContent: 'center',
    alignItems: 'center'}, eyeIconStyle]}>
        <Eye color="white" size={24} />
      </Animated.View>
      
      <Animated.View style={[{...StyleSheet.absoluteFillObject,justifyContent: 'center',
    alignItems: 'center'}, eyeOffIconStyle]}>
        <EyeOff color="white" size={24} />
      </Animated.View>
    </Animated.View>
  );
};

const EpisodeList = () => {
  const { mediaType, provider, id } = useLocalSearchParams<{
    mediaType: string;
    provider: string;
    id: string;
  }>();

  const swipeRef = useRef<SwipeableMethods>(null);
  const router = useRouter();
  const { data: episodeData, isLoading } = useAnimeEpisodes({ id, provider });
  // console.log("ep", episodeData);
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
          paddingBottom: 100,
          paddingVertical: 8,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <ReanimatedSwipeable
            ref={swipeRef}
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            onSwipeableOpen={()=>{swipeRef?.current?.close()}}
            onSwipeableWillOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            onSwipeableWillClose={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            renderRightActions={rightActions}
          >
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/watch/[mediaType]',
                  params: {
                    mediaType,
                    provider,
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
              <YStack gap={'$4'} padding={2} backgroundColor="$background">
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
                    <Text fontSize="$3" fontWeight="700" numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text fontSize="$2.5" color="$color2" fontWeight="500" numberOfLines={3}>
                      {item?.description}
                    </Text>
                    <Text
                      width="50%"
                      alignSelf="flex-end"
                      fontSize="$2.5"
                      fontWeight="500"
                      color="$color2"
                      marginLeft="auto"
                    >
                      {new Date(item.airDate).toDateString()}
                    </Text>
                  </YStack>
                </XStack>
              </YStack>
            </Pressable>
          </ReanimatedSwipeable>
        )}
        keyExtractor={(item) => item.id.toString()} //just to be sure :)
      />
    </YStack>
  );
};

export default EpisodeList;
