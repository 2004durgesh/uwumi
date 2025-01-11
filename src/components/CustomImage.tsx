import { Image } from 'expo-image';
import React, { forwardRef } from 'react';
import Animated from 'react-native-reanimated';

type CustomImageProps = {
  source: string | { uri: string; width?: number; height?: number };
  style?: object;
  [key: string]: any;
};

const CustomImage = forwardRef<Image, CustomImageProps>((props, ref) => {
  const { source, style, ...rest } = props;
  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return <Image ref={ref} source={imageSource} transition={1000} style={style} {...rest} />;
});

CustomImage.displayName = 'CustomImage';

// Create animated version of the forwarded ref component
export const AnimatedCustomImage = Animated.createAnimatedComponent(CustomImage);

export default CustomImage;
