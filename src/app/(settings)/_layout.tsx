import { useCurrentTheme, usePureBlackBackground } from '@/hooks';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import TVFocusWrapper, { isTV } from '@/components/TVFocusWrapper';

export default function SettingsLayout() {
  const currentTheme = useCurrentTheme();
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const insets = useSafeAreaInsets();
  const calculatedHeaderHeight = Platform.OS === 'ios' ? 44 + insets.top : isTV ? 63 : 56;
  // console.log('calculatedHeaderHeight', calculatedHeaderHeight);
  const StackContainer = ({ children }: { children: React.ReactNode }) => {
    if (!isTV) {
      return <>{children}</>;
    }

    // On TV, we wrap with our TV focus container
    return (
      <TVFocusWrapper
        isFocusable={false} // Container itself shouldn't be focusable
        style={{ flex: 1 }}>
        {children}
      </TVFocusWrapper>
    );
  };
  return (
    <StackContainer>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: pureBlackBackground ? '#000' : currentTheme?.background,
          },
          headerTintColor: currentTheme?.color1,
          headerTransparent: true,
          contentStyle: {
            marginTop: calculatedHeaderHeight,
            backgroundColor: pureBlackBackground ? '#000' : currentTheme?.background,
          },
          ...(isTV && {
            // TV-specific header options can go here
            headerTitleStyle: {
              fontSize: 24, // Larger font for TV
            },
            headerBackTitleVisible: false,
          }),
        }}>
        <Stack.Screen name="index" options={{ title: 'Settings' }} />
        <Stack.Screen name="about" options={{ title: 'About' }} />
        <Stack.Screen name="appearance" options={{ title: 'Appearance' }} />
        <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
      </Stack>
    </StackContainer>
  );
}
