import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text, Button, YStack, Dialog, Unspaced, XStack, View } from 'tamagui';
import { storage } from '@/hooks/stores/MMKV';
import { X, Download, ArrowUpCircle } from '@tamagui/lucide-icons';
const About = () => {
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(true);
  const currentVersion = '1.0.0-rc';
  const newVersion = '1.1.0';
  const updateType = 'Minor update';
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

      <Dialog modal open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            backgroundColor="rgba(0,0,0,0.5)"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            width="85%"
            maxWidth={400}
            padding="$5"
            // borderRadius="$6"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ opacity: 0, scale: 0.95 }}
            exitStyle={{ opacity: 0, scale: 0.95 }}
            gap="$4">
            {/* Update Icon */}
            <YStack alignItems="center" marginTop="$2" marginBottom="$2">
              <ArrowUpCircle size={48} color="$color" opacity={0.9} />
            </YStack>

            {/* Title with version numbers */}
            <Dialog.Title textAlign="center" fontSize={13} fontWeight="700">
              New Version Available
            </Dialog.Title>

            {/* Version numbers */}
            <XStack justifyContent="center" gap="$4" paddingVertical="$2">
              <YStack alignItems="center">
                <Text color="$color" opacity={0.7} fontSize={16}>
                  Current
                </Text>
                <Text fontWeight="600">{currentVersion}</Text>
              </YStack>
              <View width={1} backgroundColor="$borderColor" alignSelf="stretch" marginHorizontal="$2" />
              <YStack alignItems="center">
                <Text color="$color4" fontSize={16}>
                  New
                </Text>
                <Text color="$color4" fontWeight="600">
                  {newVersion}
                </Text>
              </YStack>
            </XStack>

            <Dialog.Description textAlign="center" paddingHorizontal="$2">
              {updateType} is now available. Updating gives you access to new features and fixes bugs.
            </Dialog.Description>

            {/* Buttons */}
            <YStack gap="$3" marginTop="$2">
              <Button
                themeInverse
                icon={Download}
                fontSize={18}
                height="$5"
                fontWeight="600"
                borderRadius="$4"
                onPress={() => {
                  // Handle download logic
                  setShowUpdateDialog(false);
                }}>
                Update Now
              </Button>

              <Button
                variant="outlined"
                fontSize={17}
                height="$4"
                borderRadius="$4"
                onPress={() => setShowUpdateDialog(false)}>
                Not Now
              </Button>
            </YStack>

            <Unspaced>
              <Dialog.Close asChild>
                <Button position="absolute" top="$3" right="$3" size="$2" circular icon={X} opacity={0.7} />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </ThemedView>
  );
};

export default About;
