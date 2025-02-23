import { StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react-native';
import { Heart } from '@tamagui/lucide-icons';
import favoriteAnimation from '../../assets/animations/like.json';
import { Stack, View } from 'tamagui';
import { ITitle, MediaFormat, MediaType, MetaProvider, TvType } from '@/constants/types';
import { useFavoriteStore } from '@/hooks/stores/useFavoriteStore';
import RippleButton from './RippleButton';
import { useCurrentTheme } from '@/hooks';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

interface AnimatedFavoriteButtonProps {
  id: string;
  title: string | ITitle;
  image: string;
  type?: MediaFormat | TvType;
  mediaType: MediaType;
  provider: string;
  metaProvider: MetaProvider;
}

const AnimatedFavoriteButton: React.FC<AnimatedFavoriteButtonProps> = (props) => {
  const { id, ...itemData } = props;
  const lottieRef = useRef<Lottie>(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const isFavorited = isFavorite(id);
  const currentTheme = useCurrentTheme();
  const opacity = useSharedValue(0);

  const setIsAnimatingState = useCallback((value: boolean) => {
    setIsAnimating(value);
  }, []);

  const playAnimation = useCallback(() => {
    lottieRef.current?.play();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const triggerHapticFeedback = useCallback(async () => {
    try {
      await impactAsync(ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }, []);

  const handleFavorite = useCallback(() => {
    if (isAnimating) return;

    if (isFavorited) {
      removeFavorite(id);
      opacity.value = withTiming(
        0,
        {
          duration: 20,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        },
        () => {
          runOnJS(setIsAnimatingState)(false);
          runOnJS(triggerHapticFeedback)();
        },
      );
    } else {
      runOnJS(setIsAnimatingState)(true);
      opacity.value = withTiming(
        1,
        {
          duration: 20,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        },
        () => {
          runOnJS(playAnimation)();
          runOnJS(triggerHapticFeedback)();
        },
      );
      addFavorite({ id, ...itemData });
    }
  }, [
    isAnimating,
    isFavorited,
    removeFavorite,
    id,
    opacity,
    setIsAnimatingState,
    triggerHapticFeedback,
    addFavorite,
    itemData,
    playAnimation,
  ]);

  const handleAnimationFinish = useCallback(() => {
    opacity.value = withTiming(
      0,
      {
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      },
      () => {
        runOnJS(setIsAnimatingState)(false);
      },
    );
  }, [opacity, setIsAnimatingState]);

  return (
    <View position="relative">
      <View width="100%" height="100%" position="absolute" top={0} left={0} zIndex={1} pointerEvents="none">
        <Animated.View style={animatedStyle}>
          <Lottie
            ref={lottieRef}
            source={favoriteAnimation}
            style={styles.lottie}
            autoPlay={false}
            loop={false}
            speed={1.3}
            renderMode="AUTOMATIC"
            onAnimationFinish={handleAnimationFinish}
          />
        </Animated.View>
      </View>
      <RippleButton onPress={handleFavorite}>
        <Heart
          size={24}
          color={isFavorited ? '$color4' : '$color'}
          fill={isFavorited ? currentTheme?.color4 : 'transparent'}
        />
      </RippleButton>
    </View>
  );
};

export default AnimatedFavoriteButton;

const styles = StyleSheet.create({
  lottie: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 6.5 }],
  },
});
