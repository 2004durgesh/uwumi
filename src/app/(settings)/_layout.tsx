import { useCurrentTheme, usePureBlackBackground } from '@/hooks';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsLayout() {
  const currentTheme = useCurrentTheme();
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const insets = useSafeAreaInsets();
  console.log(insets);
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: pureBlackBackground ? '#000' : currentTheme?.background,
        },
        headerTintColor: currentTheme?.color1,
        headerTransparent: true,
        contentStyle: {
          marginTop: insets.top + insets.top / 2,
          backgroundColor: pureBlackBackground ? '#000' : currentTheme?.background,
        },
      }}>
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      {process.env.NODE_ENV === 'development' && <Stack.Screen name="about" options={{ title: 'About' }} />}
      <Stack.Screen name="appearance" options={{ title: 'Appearance' }} />
      <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
    </Stack>
  );
}
