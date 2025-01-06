import { XStack, YStack } from 'tamagui';
import { memo } from 'react';
import { createAnimations } from '@tamagui/animations-react-native';

const MusicWave = () => {
  return (
    <XStack gap={2} alignItems="center" height={20}>
      <YStack
        width={2}
        height={15}
        backgroundColor="$color"
        animation="bouncy"
        enterStyle={{ height: 5 }}
        exitStyle={{ height: 15 }}
        pressStyle={{ height: 5 }}
      />
      <YStack
        width={2}
        height={10}
        backgroundColor="$color"
        animation="bouncy"
        enterStyle={{ height: 15 }}
        exitStyle={{ height: 5 }}
        pressStyle={{ height: 15 }}
      />
      <YStack
        width={2}
        height={20}
        backgroundColor="$color"
        animation="bouncy"
        enterStyle={{ height: 5 }}
        exitStyle={{ height: 20 }}
        pressStyle={{ height: 5 }}
      />
      <YStack
        width={2}
        height={8}
        backgroundColor="$color"
        animation="bouncy"
        enterStyle={{ height: 15 }}
        exitStyle={{ height: 8 }}
        pressStyle={{ height: 15 }}
      />
    </XStack>
  );
};

export default memo(MusicWave);