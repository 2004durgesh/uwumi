import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';
import { useCurrentTheme } from '@/hooks';
import { formatTime } from '@/constants/utils';
import TVFocusWrapper, { isTV } from '@/components/TVFocusWrapper';
import { useTVEventHandler } from 'react-native';

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  onValueChange?: (value: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ value, min, max, onValueChange }) => {
  const progress = useSharedValue(value);
  const minimumValue = useSharedValue(min);
  const maximumValue = useSharedValue(max);
  const currentTheme = useCurrentTheme();
  const [isFocused, setIsFocused] = useState(false);
  const sliderRef = useRef<any>(null);

  // Update shared values when props change
  useEffect(() => {
    progress.value = value;
  }, [value, progress]);

  useEffect(() => {
    minimumValue.value = min;
  }, [min, minimumValue]);

  useEffect(() => {
    maximumValue.value = max;
  }, [max, maximumValue]);

  // Handle TV navigation events
  const handleTVEvent = useCallback(
    (evt: { eventType: string }) => {
      if (!isFocused) return;

      const seekAmount = 10;

      switch (evt.eventType) {
        case 'right':
          const newRightValue = Math.min(value + seekAmount, max);
          if (onValueChange) onValueChange(newRightValue);
          break;
        case 'left':
          const newLeftValue = Math.max(value - seekAmount, min);
          if (onValueChange) onValueChange(newLeftValue);
          break;
      }
    },
    [isFocused, value, min, max, onValueChange],
  );

  // Use the imported hook for TV event handling
  useTVEventHandler(handleTVEvent);

  // If on TV platform, wrap slider in a TVFocusWrapper
  if (isTV) {
    return (
      <TVFocusWrapper
        isFocusable={true}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        borderColor={currentTheme?.color || '#fff'}
        borderWidth={isFocused ? 2 : 0}
        style={{ flex: 1, padding: isFocused ? 2 : 0 }}
        nextFocusUp={0}
        nextFocusDown={0}
        nextFocusLeft={0}
        nextFocusRight={0}
        id="slider">
        <Slider
          theme={{
            minimumTrackTintColor: currentTheme?.color,
            maximumTrackTintColor: '#000',
            bubbleBackgroundColor: currentTheme?.color,
          }}
          progress={progress}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          onValueChange={onValueChange}
          bubble={() => formatTime(value)}
          containerStyle={{ borderRadius: 2 }}
          bubbleTextStyle={{ color: currentTheme?.color4 }}
        />
      </TVFocusWrapper>
    );
  }

  // Standard slider for non-TV platforms
  return (
    <Slider
      theme={{
        minimumTrackTintColor: currentTheme?.color,
        maximumTrackTintColor: '#000',
        bubbleBackgroundColor: currentTheme?.color,
      }}
      progress={progress}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      onValueChange={onValueChange}
      bubble={() => formatTime(value)}
      containerStyle={{ borderRadius: 2 }}
      bubbleTextStyle={{ color: currentTheme?.color4 }}
    />
  );
};

export default CustomSlider;
