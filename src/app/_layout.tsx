// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider, Theme, createTamagui } from 'tamagui';
import { PortalProvider } from '@tamagui/portal';
import { Toaster } from 'sonner-native';
import config from '../../tamagui.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Inter_500Medium as InterMedium,
  Inter_600SemiBold as InterSemiBold,
  Inter_800ExtraBold as InterBold,
} from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeStore } from '@/hooks';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  // console.log(process.env);
  const [loaded] = useFonts({
    InterMedium,
    InterSemiBold,
    InterBold,
  });
  const themeName = useThemeStore((state) => state.themeName);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retryDelay: 1000,
      },
    },
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={tamaguiConfig}>
          <PortalProvider>
            <Theme name={themeName}>
              <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="info/[mediaType]" />
                <Stack.Screen name="watch/[mediaType]" />
                <Stack.Screen name="read/[id]" />
                <Stack.Screen name="(settings)" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </Theme>
          </PortalProvider>
          <Toaster
            position="bottom-center"
            invert
            autoWiggleOnUpdate="always"
            richColors
            swipeToDismissDirection="left"
          />
        </TamaguiProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
