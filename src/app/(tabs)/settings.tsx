import { Button, XStack, YStack } from "tamagui";
import React, { memo, useCallback } from "react";
import { useThemeStore, useAccentStore } from "@/stores";
import { ThemedView } from "@/components/ThemedView";

const ThemeSelector = memo(() => {
  const setThemeName = useThemeStore((state) => state.setThemeName);
  const currentTheme = useThemeStore((state) => state.themeName);

  return (
    <XStack gap={10} justifyContent="center">
      <Button 
        themeInverse 
        onPress={() => setThemeName("light")}
        opacity={currentTheme === 'light' ? 0.5 : 1}
      >
        Light Theme
      </Button>
      <Button 
        themeInverse 
        onPress={() => setThemeName("dark")}
        opacity={currentTheme === 'dark' ? 0.5 : 1}
      >
        Dark Theme
      </Button>
    </XStack>
  );
});

const AccentSelector = memo(() => {
  const setAccentName = useAccentStore((state) => state.setAccentName);
  const currentAccent = useAccentStore((state) => state.accentName);

  const handleAccentChange = useCallback((accent: string) => {
    setAccentName(accent);
  }, [setAccentName]);

  return (
    <YStack gap={10} marginTop={10} marginHorizontal={10} justifyContent="center">
      <Button 
        themeInverse 
        onPress={() => handleAccentChange("default")}
        opacity={currentAccent === 'default' ? 0.5 : 1}
      >
        Base Accent
      </Button>
      <Button 
        themeInverse 
        onPress={() => handleAccentChange("cloudflare")}
        opacity={currentAccent === 'cloudflare' ? 0.5 : 1}
      >
        Cloudflare Accent
      </Button>
      <Button 
        themeInverse 
        onPress={() => handleAccentChange("cottonCandy")}
        opacity={currentAccent === 'cottonCandy' ? 0.5 : 1}
      >
        Cotton Candy Accent
      </Button>
    </YStack>
  );
});

const Settings = () => {
  return (
    <ThemedView>
      <ThemeSelector />
      <AccentSelector />
    </ThemedView>
  );
};

export default Settings;