import { ThemedView } from '@/components/ThemedView';
import { X } from '@tamagui/lucide-icons';
import { Button, YStack, Text, XStack, Dialog, View } from 'tamagui';
import { useState } from 'react';

const Example = () => {
  const [open, setOpen] = useState(false);

  return (
    <ThemedView>
      <YStack padding="$4" gap="$4">
        <Text fontSize="$6" fontWeight="700">
          Sheet with Popover Example
        </Text>

        <Button onPress={() => setOpen(true)}>Open Dialog</Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content
              bordered
              elevate
              key="content"
              width={'85%'}
              padding="$5"
              borderRadius="$6"
              position="relative"
              alignSelf={'center'}
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
              <XStack flexWrap="wrap" justifyContent="space-between" alignItems="center" padding="$4" gap="$4">
                <View backgroundColor={'red'} padding="$2" borderRadius="$2" flex={1} minWidth="$12">
                  <Text fontSize="$5" fontWeight="700">
                    View 1
                  </Text>
                  <Button onPress={() => setOpen(false)} icon={X} />
                </View>
                <View backgroundColor={'green'} padding="$2" borderRadius="$2" flex={1} minWidth="$12">
                  <Text fontSize="$5" fontWeight="700">
                    View 2
                  </Text>
                  <Button onPress={() => setOpen(false)} icon={X} />
                </View>
              </XStack>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </YStack>
    </ThemedView>
  );
};

export default Example;
