import React, { memo, useEffect } from 'react';
import Animated, { withRepeat, withTiming, useAnimatedStyle, useSharedValue, withDelay } from 'react-native-reanimated';
import { XStack, useTheme } from 'tamagui';

const AnimatedBar = memo(({ delay }: { delay: number }) => {
  const height = useSharedValue(3);
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    width: 2,
    height: height.value,
    backgroundColor: theme?.color4?.val,
    borderRadius: 1,
  }));

  useEffect(() => {
    const randomDuration = Math.floor(400 + Math.random() * 200);

    height.value = withDelay(delay, withRepeat(withTiming(12, { duration: randomDuration }), -1, true));
  }, [delay, height]);

  return <Animated.View style={animatedStyle} />;
});
AnimatedBar.displayName = 'AnimatedBar';

const WavyAnimation = memo(() => {
  const bars = [0, 50, 75, 100, 0]; // Different delays for each bar

  return (
    <XStack height={12} gap={2} alignItems="center">
      {bars.map((delay, index) => (
        <AnimatedBar key={index} delay={delay} />
      ))}
    </XStack>
  );
});
WavyAnimation.displayName = 'WavyAnimation';

export default WavyAnimation;
