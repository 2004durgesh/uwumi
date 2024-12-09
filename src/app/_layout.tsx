// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Button, TamaguiProvider, XStack, createTamagui } from "tamagui";
import config from "../../tamagui.config";
import { useColorScheme } from "@/hooks/useColorScheme";
import useThemeStore from "@/stores/useThemeStore";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const themeName = useThemeStore((state:any) => state.themeName);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000,   // 30 minutes
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="info/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
