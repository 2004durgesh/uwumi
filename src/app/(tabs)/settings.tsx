import { Button, TamaguiProvider, View, XStack, YStack, createTamagui } from "tamagui";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useThemeStore from "@/stores/useThemeStore";
import { ThemedView } from "@/components/ThemedView";

const settings = () => {
  const setThemeName = useThemeStore((state: any) => state.setThemeName);
  return (
    <ThemedView>
      <XStack gap={10} justifyContent="center">
        <Button themeInverse onPress={() => setThemeName("light")}>
          Set theme light
        </Button>
        <Button themeInverse onPress={() => setThemeName("dark")}>
          Set theme dark
        </Button>
      </XStack>

      <YStack gap={10}  marginTop={10} marginHorizontal={10} justifyContent="center">
        <Button themeInverse onPress={() => setThemeName("default")}>
          Set base accent
        </Button>
        <Button themeInverse onPress={() => setThemeName("cloudflare")}>
          Set cloudflare accent
        </Button>
        <Button themeInverse onPress={() => setThemeName("cottonCandy")}>
          Set cottonCandy accent
        </Button>
      </YStack>
    </ThemedView>
  );
};

export default settings;
