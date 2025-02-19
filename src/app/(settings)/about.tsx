import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text, View, Popover, Button, YStack, XStack, Input } from 'tamagui';
import Ripple from 'react-native-material-ripple';
import { storage } from '@/hooks/stores/MMKV';

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

      {/* press the button to see all the mmkv storage */}
      <Button
        onPress={() => {
          // console.log(storage.getAllKeys().forEach((key) => console.log(key)));
          console.log(JSON.parse(storage.getString('watch-progress')!))
        }}>
        <Text>Press to see all the mmkv storage</Text>
      </Button>
    </ThemedView>
  );
};

export default About;
