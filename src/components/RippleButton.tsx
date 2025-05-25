import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Canvas, Circle } from '@shopify/react-native-skia';
import { makeMutable, withTiming, Easing, runOnJS, SharedValue, WithTimingConfig } from 'react-native-reanimated';
import { View } from 'tamagui';
import { useThemeStore } from '@/hooks';

interface RippleItem {
  id: string;
  x: number;
  y: number;
  radius: SharedValue<number>;
  opacity: SharedValue<number>;
  isActive: boolean;
}

interface RippleOverlayProps {
  style?: ViewStyle;
  maxRadius?: number;
  duration?: number;
  rippleColor?: string;
  animationEasing?: WithTimingConfig['easing'];
  numberOfTaps?: number;
  onRippleAnimationStart?: (id: string) => void;
  onRippleAnimationEnd?: (id: string) => void;
  onPress?: (event: { x: number; y: number }) => void;
  children?: React.ReactNode;
}

function RippleOverlay(props: RippleOverlayProps) {
  const {
    style,
    maxRadius = 100,
    duration = 500,
    rippleColor = 'rgba(255, 255, 255, 1)',
    animationEasing = Easing.out(Easing.ease),
    numberOfTaps = 2,
    onRippleAnimationStart,
    onRippleAnimationEnd,
    onPress,
    children,
  } = props;

  // Pre-allocate ripple pool to avoid creating new SharedValues
  const ripplePool = useRef<RippleItem[]>([]);
  const activeRipples = useRef<Set<string>>(new Set());
  const [renderTrigger, setRenderTrigger] = useState(0);
  const isMounted = useRef(true);

  // Initialize ripple pool with reusable SharedValues
  useEffect(() => {
    if (ripplePool.current.length === 0) {
      for (let i = 0; i < 5; i++) {
        // Pool of 5 ripples should be enough
        ripplePool.current.push({
          id: `pool-${i}`,
          x: 0,
          y: 0,
          radius: makeMutable(0),
          opacity: makeMutable(0),
          isActive: false,
        });
      }
    }

    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const deactivateRipple = useCallback(
    (rippleId: string) => {
      if (!isMounted.current) return;

      const ripple = ripplePool.current.find((r) => r.id === rippleId && r.isActive);
      if (ripple) {
        ripple.isActive = false;
        activeRipples.current.delete(rippleId);
        setRenderTrigger((prev) => prev + 1);

        if (onRippleAnimationEnd) {
          onRippleAnimationEnd(rippleId);
        }
      }
    },
    [onRippleAnimationEnd],
  );

  const createRipple = useCallback(
    (tapX: number, tapY: number) => {
      if (!isMounted.current) return;

      // Find an inactive ripple from the pool
      const availableRipple = ripplePool.current.find((r) => !r.isActive);
      if (!availableRipple) return; // No available ripples

      // Reset and configure the ripple
      availableRipple.x = tapX;
      availableRipple.y = tapY;
      availableRipple.isActive = true;
      availableRipple.radius.value = 0;
      availableRipple.opacity.value = 1;

      const rippleId = `${availableRipple.id}-${Date.now()}`;
      availableRipple.id = rippleId;
      activeRipples.current.add(rippleId);

      setRenderTrigger((prev) => prev + 1);

      if (onRippleAnimationStart) {
        onRippleAnimationStart(rippleId);
      }

      // Start animations
      availableRipple.radius.value = withTiming(maxRadius, {
        duration,
        easing: animationEasing,
      });

      availableRipple.opacity.value = withTiming(
        0,
        {
          duration,
          easing: animationEasing,
        },
        (finished) => {
          'worklet';
          runOnJS(deactivateRipple)(rippleId);
        },
      );
    },
    [maxRadius, duration, animationEasing, onRippleAnimationStart, deactivateRipple],
  );

  // Simplified gesture handling
  const tapGesture = Gesture.Tap()
    .numberOfTaps(numberOfTaps)
    .maxDuration(250) // Shorter timeout for better responsiveness
    .onStart((event) => {
      'worklet';
      runOnJS(createRipple)(event.x, event.y);
      if (onPress) {
        runOnJS(onPress)({ x: event.x, y: event.y });
      }
    });

  const activeRipplesArray = ripplePool.current.filter((r) => r.isActive);

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={[styles.container, style]} collapsable={false}>
        {children}
        {activeRipplesArray.length > 0 && (
          <Canvas style={styles.canvasOverlay} pointerEvents="none">
            {activeRipplesArray.map((ripple) => (
              <Circle
                key={ripple.id}
                cx={ripple.x}
                cy={ripple.y}
                r={ripple.radius}
                color={rippleColor}
                opacity={ripple.opacity}
              />
            ))}
          </Canvas>
        )}
      </View>
    </GestureDetector>
  );
}

interface RippleButtonProps {
  onPress: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  enableDoubleTap?: boolean; // New prop for better control
}

export const RippleButton: React.FC<RippleButtonProps> = ({ onPress, children, style, enableDoubleTap = false }) => {
  const themeName = useThemeStore((state) => state.themeName);

  return (
    <RippleOverlay
      maxRadius={40}
      duration={500}
      numberOfTaps={enableDoubleTap ? 2 : 1}
      rippleColor={themeName === 'light' ? 'black' : 'white'}
      onPress={onPress}
      style={style}>
      <View padding={10}>{children}</View>
    </RippleOverlay>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  canvasOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
});
export { RippleOverlay };
export default RippleButton;
