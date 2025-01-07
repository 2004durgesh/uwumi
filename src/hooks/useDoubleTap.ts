import { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  runOnJS,
  useSharedValue,
} from 'react-native-reanimated';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

interface UseDoubleTapGestureProps {
  videoRef: React.RefObject<any>;
  isLocked?: boolean;
  seekInterval?: number;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
}

export const useDoubleTapGesture = ({
  videoRef,
  isLocked = false,
  seekInterval = 10,
  onSeekStart,
  onSeekEnd,
}: UseDoubleTapGestureProps) => {
  const [isDoubleTap, setIsDoubleTap] = useState(false);
  const tapCount = useSharedValue(0);
  const lastTap = useRef(0);
  const animationTimeoutRef = useRef<NodeJS.Timeout>();

  // Animation values
  const forwardOpacity = useSharedValue(0);
  const backwardOpacity = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  // Separate counters for consecutive taps
  const consecutiveTapCount = useRef({
    forward: 0,
    backward: 0,
    lastDirection: null as 'forward' | 'backward' | null,
    lastTapTime: 0,
  });

  const [doubleTapValue, setDoubleTapValue] = useState({
    forward: 0,
    backward: 0,
  });

  const resetConsecutiveCount = useCallback(
    (direction: 'forward' | 'backward') => {
      consecutiveTapCount.current = {
        forward: 0,
        backward: 0,
        lastDirection: null,
        lastTapTime: 0,
      };
      setDoubleTapValue((prev) => ({
        ...prev,
        [direction]: seekInterval,
      }));
    },
    [seekInterval],
  );

  const triggerHapticFeedback = useCallback(async () => {
    try {
      await impactAsync(ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }, []);

  const showTapAnimation = useCallback(
    (direction: 'forward' | 'backward') => {
      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      const animationValue = direction === 'forward' ? forwardOpacity : backwardOpacity;

      animationValue.value = withSequence(withSpring(1), withTiming(0, { duration: 250 }));

      scaleValue.value = withSequence(withSpring(1.2), withSpring(1));

      // Set a timeout to reset the counter after animation ends
      animationTimeoutRef.current = setTimeout(() => {
        runOnJS(resetConsecutiveCount)(direction);
      }, 1000); // Adjust timeout duration as needed
    },
    [forwardOpacity, backwardOpacity, scaleValue, resetConsecutiveCount],
  );

  const handleSeek = useCallback(
    async (direction: 'forward' | 'backward') => {
      if (!videoRef.current) return;

      const now = Date.now();
      const timeSinceLastTap = now - consecutiveTapCount.current.lastTapTime;
      const isConsecutive = timeSinceLastTap < 500 && direction === consecutiveTapCount.current.lastDirection;

      try {
        const currentTime = await videoRef.current.getCurrentPosition();
        const seekAmount = direction === 'forward' ? seekInterval : -seekInterval;
        const newPosition = Math.max(currentTime + seekAmount, 0);

        videoRef.current.seek(newPosition);

        if (isConsecutive) {
          consecutiveTapCount.current[direction]++;
          setDoubleTapValue((prev) => ({
            ...prev,
            [direction]: seekInterval * (consecutiveTapCount.current[direction] + 1),
          }));
        } else {
          consecutiveTapCount.current = {
            forward: 0,
            backward: 0,
            lastDirection: direction,
            lastTapTime: now,
          };
          setDoubleTapValue((prev) => ({
            ...prev,
            [direction]: seekInterval,
          }));
        }

        consecutiveTapCount.current.lastDirection = direction;
        consecutiveTapCount.current.lastTapTime = now;

        // Trigger animations and feedback
        runOnJS(triggerHapticFeedback)();
        runOnJS(showTapAnimation)(direction);
      } catch (error) {
        console.error('Seek failed:', error);
      }
    },
    [videoRef, seekInterval, showTapAnimation, triggerHapticFeedback],
  );

  const doubleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .maxDuration(250)
        .onStart((event) => {
          if (isLocked) return;

          const now = Date.now();
          const timeSinceLastTap = now - lastTap.current;
          lastTap.current = now;

          if (timeSinceLastTap > 500) {
            tapCount.value = 0;
          }

          runOnJS(setIsDoubleTap)(true);
          if (onSeekStart) {
            runOnJS(onSeekStart)();
          }

          const touchX = event.absoluteX;
          const screenMidPoint = Dimensions.get('window').width / 2;
          const direction = touchX < screenMidPoint ? 'backward' : 'forward';

          runOnJS(handleSeek)(direction);
        })
        .onEnd(() => {
          runOnJS(setIsDoubleTap)(false);
          if (onSeekEnd) {
            runOnJS(onSeekEnd)();
          }
        })
        .runOnJS(true),
    [isLocked, tapCount, handleSeek, onSeekStart, onSeekEnd],
  );

  const forwardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: forwardOpacity.value,
    transform: [{ scale: scaleValue.value }],
  }));

  const backwardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backwardOpacity.value,
    transform: [{ scale: scaleValue.value }],
  }));

  return {
    doubleTapGesture,
    isDoubleTap,
    doubleTapValue,
    forwardAnimatedStyle,
    backwardAnimatedStyle,
  };
};

// Usage Example:
/*
const VideoPlayer = () => {
  const videoRef = useRef(null);
  
  const {
    doubleTapGesture,
    isDoubleTap,
    doubleTapValue,
    forwardAnimatedStyle,
    backwardAnimatedStyle
  } = useDoubleTapGesture({
    videoRef,
    seekInterval: 10,
    onSeekStart: () => console.log('Seeking started'),
    onSeekEnd: () => console.log('Seeking ended')
  });

  return (
    <GestureDetector gesture={doubleTapGesture}>
      <View style={styles.container}>
        <Video ref={videoRef} {...videoProps} />
        
        
        <Animated.View style={[styles.forwardIndicator, forwardAnimatedStyle]}>
          <Text style={styles.seekText}>+{doubleTapValue.forward}s</Text>
        </Animated.View>
        
        <Animated.View style={[styles.backwardIndicator, backwardAnimatedStyle]}>
          <Text style={styles.seekText}>-{doubleTapValue.backward}s</Text>
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  forwardIndicator: {
    position: 'absolute',
    right: '25%',
    top: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 40,
  },
  backwardIndicator: {
    position: 'absolute',
    left: '25%',
    top: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 40,
  },
  seekText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
};
*/
