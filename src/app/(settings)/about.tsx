import React, { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text, Button, YStack } from 'tamagui';
import Ripple from 'react-native-material-ripple';
import { storage } from '@/hooks/stores/MMKV';
import FullscreenModule from '../../../modules/fullscreen-module';
const About = () => {
  console.log(FullscreenModule);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = async () => {
    // Check if the module has these methods
    console.log('FullscreenModule methods:', Object.keys(FullscreenModule));

    if (FullscreenModule.enterFullscreen && FullscreenModule.exitFullscreen) {
      try {
        if (isFullscreen) {
          await FullscreenModule.exitFullscreen();
        } else {
          await FullscreenModule.enterFullscreen();
        }
        setIsFullscreen(!isFullscreen);
      } catch (error) {
        console.error('Fullscreen error:', error);
      }
    } else {
      console.error('Fullscreen methods not available');
    }
  };
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
        <Button onPress={handleFullscreen}>
          <Text>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</Text>
        </Button>
      </YStack>
    </ThemedView>
  );
};

export default About;
