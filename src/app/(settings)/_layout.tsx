import { useCurrentTheme, usePureBlackBackground } from '@/hooks';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function SettingsLayout() {
  const currentTheme = useCurrentTheme();
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const insets = useSafeAreaInsets();
  const calculatedHeaderHeight = Platform.OS === 'ios' ? 44 + insets.top : 56;

  return (
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
      }}>
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="appearance" options={{ title: 'Appearance' }} />
      <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
    </Stack>
  );
}
