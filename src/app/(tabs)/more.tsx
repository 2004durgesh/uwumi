import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text, YStack, XStack, Separator } from 'tamagui';
import { Route, useRouter } from 'expo-router';
import { Settings, Palette, Info, Heart } from '@tamagui/lucide-icons';
import { Pressable } from 'react-native';

const MenuItem = ({ href, icon: Icon, label }: { href: Route; icon: React.ElementType; label: string }) => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(href)}>
      <XStack padding="$4" alignItems="center" gap="$4">
        <Icon size={24} color="$color" />
        <Text fontSize="$4" fontWeight="500">
          {label}
        </Text>
      </XStack>
    </Pressable>
  );
};

const More = () => {
  return (
    <ThemedView>
      <YStack flex={1}>
        <YStack marginTop="$4">
          <MenuItem href="/(settings)/appearance" icon={Palette} label="Appearance" />
          <Separator />
          <MenuItem href="/(settings)" icon={Settings} label="Settings" />
          <Separator />
          <MenuItem href="/(settings)/favorites" icon={Heart} label="Favorites" />
          <Separator />
          <MenuItem href="/(settings)/about" icon={Info} label="About" />
        </YStack>
      </YStack>
    </ThemedView>
  );
};

export default More;
