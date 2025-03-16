import React, { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';
import { useCurrentTheme } from '@/hooks';
import { formatTime } from '@/constants/utils';

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
