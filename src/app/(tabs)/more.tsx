import React, { useEffect, useRef, useMemo } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text, YStack, XStack, Separator } from 'tamagui';
import { Route, useRouter } from 'expo-router';
import { Settings, Palette, Info, Heart } from '@tamagui/lucide-icons';
import { Pressable, View, findNodeHandle } from 'react-native';
import { useCurrentTheme } from '@/hooks';

// Enhanced MenuItem with improved TV focus support
const MenuItem = ({
  href,
  icon: Icon,
  label,
}: {
  href: Route;
  icon: React.ElementType;
  label: string;
  index?: number;
  totalItems?: number;
  refs?: React.MutableRefObject<(View | null)[]>;
  nextFocusUp?: number | null;
  nextFocusDown?: number | null;
}) => {
  const router = useRouter();

  const handlePress = () => {
    console.log(`Navigating to: ${href}`);
    router.push(href);
  };

  return (
    <Pressable onPress={handlePress} style={{ width: '100%' }}>
      <XStack padding="$4" alignItems="center" gap="$4">
        <Icon color="$color" />
        <Text fontSize="$4" fontWeight="500">
          {label}
        </Text>
      </XStack>
    </Pressable>
  );
};

const More = () => {
  // Maintain refs to all menu items for programmatic focus management
  const itemRefs = useRef<(View | null)[]>([]);

  // Create menu items array to manage indices with useMemo to prevent recreation on each render
  const menuItems = useMemo(
    () => [
      { href: '/(settings)/appearance' as Route, icon: Palette, label: 'Appearance' },
      { href: '/(settings)' as Route, icon: Settings, label: 'Settings' },
      { href: '/(settings)/favorites' as Route, icon: Heart, label: 'Favorites' },
      { href: '/(settings)/about' as Route, icon: Info, label: 'About' },
    ],
    [],
  );

  const totalItems = menuItems.length;

  return (
    <ThemedView>
      <YStack flex={1}>
        <YStack marginTop="$4">
          {menuItems.map((item, index) => (
            <View key={item.label} style={{ width: '100%' }}>
              <MenuItem href={item.href} icon={item.icon} label={item.label} />
              {index < totalItems - 1 && <Separator />}
            </View>
          ))}
        </YStack>
      </YStack>
    </ThemedView>
  );
};

export default More;
