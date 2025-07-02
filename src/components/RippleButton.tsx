import { useThemeStore } from '@/hooks';
import React, { FC } from 'react';
import { TouchableWithoutFeedbackProps } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { View } from 'tamagui';

interface RippleButtonProps extends TouchableWithoutFeedbackProps {
  onPress: () => void;
  children?: React.ReactNode;
}

const RippleButton: FC<RippleButtonProps> = ({ onPress, children }) => {
  const themeName = useThemeStore((state) => state.themeName);
  return (
    <Ripple
      onPress={(e) => {
        onPress();
        // e.preventDefault();
        // e.stopPropagation();
      }}
      rippleColor={themeName === 'light' ? 'black' : 'white'}
      rippleDuration={500}
      rippleContainerBorderRadius={50}
      rippleOpacity={1}>
      <View padding={10}>{children}</View>
    </Ripple>
  );
};

export default RippleButton;