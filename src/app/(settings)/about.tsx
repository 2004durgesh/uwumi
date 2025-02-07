import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text, View, Popover, Button, YStack, XStack, Input } from 'tamagui';
import Ripple from 'react-native-material-ripple';
import { ChevronDown } from '@tamagui/lucide-icons';
import { Alert } from 'react-native';
import ProviderSelect from '@/components/CustomSelect';

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

      <View
        backgroundColor="$background"
        borderRadius="$4"
        padding="$4"
        marginTop="$4"
        borderWidth={1}
        borderColor="$borderColor"
        width="100%">
        <Text fontSize="$6" fontWeight="$6" marginBottom="$2">
          Settings
        </Text>
        <Popover>
          <Popover.Trigger asChild>
            <Button icon={ChevronDown} size="$4" variant="outlined" marginVertical="$2" />
          </Popover.Trigger>
          <Popover.Content
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$4"
            padding="$4"
            enterStyle={{ y: -10, opacity: 0 }}
            exitStyle={{ y: -10, opacity: 0 }}
            elevate
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}>
            <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

            <YStack space="$4" padding="$2">
              <XStack space="$3" alignItems="center">
                <Text fontSize="$5">Name</Text>
                <Input flex={1} size="$4" borderRadius="$2" borderColor="$borderColor" />
              </XStack>

              <Popover.Close asChild>
                <Button
                  size="$4"
                  theme="active"
                  onPress={() => {
                    Alert.prompt('Submitted');
                  }}>
                  Submit
                </Button>
              </Popover.Close>
            </YStack>
          </Popover.Content>
        </Popover>
      </View>
      <ProviderSelect currentProvider="crunchyroll" onProviderChange={() => {}} />
    </ThemedView>
  );
};

export default About;
