import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text } from 'tamagui';
import Ripple from 'react-native-material-ripple';

const About = () => {
  return (
    <ThemedView>
      <Text>About ji</Text>
      <Ripple
        rippleColor="red"
        rippleOpacity={0.5}
        style={{
          padding: 16,
          borderRadius: 8,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '$borderColor',
          marginTop: 16,
        }}>
        <Text fontSize={16} fontWeight="600" color="$color">
          touch me
        </Text>
      </Ripple>
    </ThemedView>
  );
};

export default About;
