import React, { useEffect, useRef, useMemo } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text, YStack, XStack, Separator } from 'tamagui';
import { Route, useRouter } from 'expo-router';
import { Settings, Palette, Info, Heart } from '@tamagui/lucide-icons';
import { Pressable, View, findNodeHandle } from 'react-native';
import TVFocusWrapper, { isTV } from '@/components/TVFocusWrapper';
import { useCurrentTheme } from '@/hooks';

// Enhanced MenuItem with improved TV focus support
const MenuItem = ({
  href,
  icon: Icon,
  label,
  index = 0,
  totalItems = 1,
  refs,
  nextFocusUp,
  nextFocusDown,
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
  const currentTheme = useCurrentTheme();
  const elementRef = useRef<View | null>(null);

  const handlePress = () => {
    console.log(`Navigating to: ${href}`);
    router.push(href);
  };

  // Store ref in parent's refs array for focus management
  useEffect(() => {
    if (isTV && refs && elementRef.current) {
      refs.current[index] = elementRef.current;
    }
  }, [index, refs]);

  return (
    <TVFocusWrapper
      ref={elementRef}
      isFocusable={isTV}
      hasTVPreferredFocus={isTV && index === 0} // First item gets preferred focus
      id={`MenuItem-${label}`}
      style={{ marginVertical: isTV ? 8 : 0 }}
      onPress={handlePress}
      borderColor={currentTheme?.color4}
      borderWidth={2}
      nextFocusDown={nextFocusDown!}
      nextFocusUp={nextFocusUp!}>
      <Pressable onPress={handlePress} style={{ width: '100%' }}>
        <XStack padding="$4" alignItems="center" gap="$4">
          <Icon size={isTV ? 30 : 24} color="$color" />
          <Text fontSize={isTV ? '$5' : '$4'} fontWeight="500">
            {label}
          </Text>
        </XStack>
      </Pressable>
    </TVFocusWrapper>
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

  // Set up focus trap to keep focus within this menu
  useEffect(() => {
    if (isTV) {
      // Ensure refs array is initialized with the correct length
      itemRefs.current = new Array(totalItems).fill(null);

      console.log(`Setting up focus management for ${totalItems} items`);
    }
  }, [totalItems]);

  // Programmatically set up focus navigation after rendering
  useEffect(() => {
    if (!isTV) return;

    // Wait for refs to be populated
    const timeout = setTimeout(() => {
      itemRefs.current.forEach((ref, index) => {
        if (!ref) return;

        // Calculate prev/next indices with wrapping
        const prevIndex = index > 0 ? index - 1 : totalItems - 1;
        const nextIndex = index < totalItems - 1 ? index + 1 : 0;

        // Get the refs themselves (not node handles)
        const prevRef = itemRefs.current[prevIndex];
        const nextRef = itemRefs.current[nextIndex];

        // Get corresponding node handles
        const prevNode = prevRef ? findNodeHandle(prevRef) : null;
        const nextNode = nextRef ? findNodeHandle(nextRef) : null;

        if (prevNode) {
          // Set the nextFocusUp property
          ref.setNativeProps({
            nextFocusUp: prevNode,
          });
          console.log(`Set nextFocusUp for ${menuItems[index].label} to ${menuItems[prevIndex].label}`);
        }

        if (nextNode) {
          // Set the nextFocusDown property
          ref.setNativeProps({
            nextFocusDown: nextNode,
          });
          console.log(`Set nextFocusDown for ${menuItems[index].label} to ${menuItems[nextIndex].label}`);
        }
      });
    }, 1000); // Give more time for components to mount

    return () => clearTimeout(timeout);
  }, [totalItems, menuItems]);

  return (
    <ThemedView>
      <YStack flex={1}>
        <YStack marginTop="$4" gap={isTV ? '$2' : 0} paddingHorizontal={isTV ? '$4' : 0}>
          {menuItems.map((item, index) => (
            <View key={item.label} style={{ width: '100%' }}>
              <MenuItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                index={index}
                totalItems={totalItems}
                refs={itemRefs}
                nextFocusUp={
                  index > 0
                    ? findNodeHandle(itemRefs.current[index - 1])
                    : findNodeHandle(itemRefs.current[totalItems - 1])
                }
                nextFocusDown={
                  index < totalItems - 1
                    ? findNodeHandle(itemRefs.current[index + 1])
                    : findNodeHandle(itemRefs.current[0])
                }
              />
              {index < totalItems - 1 && <Separator />}
            </View>
          ))}
        </YStack>
      </YStack>
    </ThemedView>
  );
};

export default More;
