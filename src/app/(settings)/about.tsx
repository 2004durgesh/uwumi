import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text, Button, YStack } from 'tamagui';
import { storage } from '@/hooks/stores/MMKV';
import CustomSlider from '../watch/CustomSlider';
const About = () => {
  return (
    <ThemedView>
      <Text>About ji</Text>

      {/* press the button to see all the mmkv storage */}
      <YStack alignItems="center" gap={10} margin={10}>
        <Button
          onPress={() => {
            console.log(JSON.parse(storage.getString('mediaProviders') || '{}'));
            // console.log(JSON.parse(storage.getString('theme') || '{}'));
            console.log(JSON.parse(storage.getString('favorites') || '{}'));
            console.log(JSON.parse(storage.getString('pureBlack') || '{}'));
            console.log(JSON.parse(storage.getString('watchProgress') || '{}'));
          }}>
          <Text>Press to see all the mmkv storage</Text>
        </Button>
        <Button
          onPress={() => {
            storage.delete('watchProgress');
            storage.delete('favorites');
          }}>
          <Text>delete progress</Text>
        </Button>
      </YStack>
      <CustomSlider />
    </ThemedView>
  );
};

export default About;
