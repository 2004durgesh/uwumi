import { Button, Circle, Separator, Switch, Text, View, XStack, YStack } from 'tamagui';
import React, { memo, useCallback } from 'react';
import { useThemeStore, useAccentStore, usePureBlackBackground, useCurrentTheme } from '@/hooks';
import { ThemedView } from '@/components/ThemedView';
import { Pressable } from 'react-native';
import { themes } from '@/constants/Theme';
import { FlatList } from 'react-native';
import { Check } from '@tamagui/lucide-icons';

const Appearance = () => {
  const setThemeName = useThemeStore((state) => state.setThemeName);
  const themeName = useThemeStore((state) => state.themeName);
  const setAccentName = useAccentStore((state) => state.setAccentName);
  const accentName = useAccentStore((state) => state.accentName);
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const setPureBlackBackground = usePureBlackBackground((state) => state.setPureBlackBackground);
  const currentTheme = useCurrentTheme();

  const ThemeSelector = memo(() => {
    return (
      <View alignItems="center" justifyContent="center" marginVertical={24}>
        <XStack width="50%" borderWidth={2} borderColor="$color2" overflow="hidden" borderRadius={10}>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: themeName === 'light' ? currentTheme?.color4 : 'transparent',
            }}
            onPress={() => {
              setThemeName('light');
              setPureBlackBackground(false);
            }}>
            <Text color={currentTheme?.color1} fontWeight="500" fontSize={18} textAlign="center">
              Light
            </Text>
          </Pressable>
          <Separator vertical />
          <Pressable
            style={{
              flex: 1,
              backgroundColor: themeName === 'dark' ? currentTheme?.color4 : 'transparent',
            }}
            onPress={() => setThemeName('dark')}>
            <Text color={currentTheme?.color1} fontWeight="500" fontSize={18} textAlign="center">
              Dark
            </Text>
          </Pressable>
        </XStack>
      </View>
    );
  });

  const AccentSelector = memo(() => {
    // Get all themes for current mode (light/dark)
    const allThemes = Object.entries(themes).filter(([key]) => key.startsWith(themeName));

    // Get unique accent names
    const accentThemes = allThemes
      .map(([key]) => {
        const [_, accent] = key.split('_');
        return accent;
      })
      .filter((item) => item !== undefined);

    // console.log(allThemes, accentThemes);

    const handleAccentChange = useCallback(
      (accent: string) => {
        setAccentName(accent);
      },
      [setAccentName],
    );

    return (
      <View>
        <FlatList
          horizontal
          data={accentThemes}
          contentContainerStyle={{ padding: 8, gap: 16 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: accent }) => (
            <YStack key={accent}>
              <Pressable
                onPress={() => handleAccentChange(accent)}
                style={{
                  height: 150,
                  width: 100,
                  backgroundColor: pureBlackBackground ? '#000' : themes[`${themeName}_${accent}`]?.background,
                  borderRadius: 10,
                  borderColor:
                    accentName === accent
                      ? themes[`${themeName}_${accent}`]?.color
                      : themes[`${themeName}_${accent}`]?.color2,
                  borderWidth: 2,
                  overflow: 'hidden',
                }}>
                <YStack flex={1}>
                  <YStack flex={1} justifyContent="space-between">
                    <YStack gap={4} margin="$2">
                      <XStack height={15} gap={8}>
                        <View width={50} borderRadius={10} backgroundColor={themes[`${themeName}_${accent}`]?.color1} />
                        {accentName === accent && (
                          <Circle size={15} backgroundColor={themes[`${themeName}_${accent}`]?.color}>
                            <Check size={12} strokeWidth={3.5} color={themes[`${themeName}_${accent}`]?.color4} />
                          </Circle>
                        )}
                      </XStack>
                      <View
                        width="50%"
                        height={60}
                        borderRadius={10}
                        backgroundColor={themes[`${themeName}_${accent}`]?.color2}>
                        <XStack margin={4}>
                          <View
                            borderRadius={6}
                            width="100%"
                            height={13}
                            backgroundColor={themes[`${themeName}_${accent}`]?.color4}
                          />
                        </XStack>
                      </View>
                    </YStack>
                    <View
                      backgroundColor={themes[`${themeName}_${accent}`]?.color2}
                      height={20}
                      alignItems="center"
                      justifyContent="center">
                      <XStack marginHorizontal="$2" height={15} gap={8}>
                        <Circle size={15} backgroundColor={themes[`${themeName}_${accent}`]?.color} />
                        <View
                          flex={1}
                          width="70%"
                          borderRadius={10}
                          backgroundColor={themes[`${themeName}_${accent}`]?.color3}
                        />
                      </XStack>
                    </View>
                  </YStack>
                </YStack>
              </Pressable>
              <Text textAlign="center" textTransform="capitalize">
                {accent}
              </Text>
            </YStack>
          )}
        />
      </View>
    );
  });
  ThemeSelector.displayName = 'ThemeSelector';
  AccentSelector.displayName = 'AccentSelector';
  return (
    <ThemedView padding={10}>
      <ThemeSelector />
      <AccentSelector />
      {themeName === 'dark' && (
        <XStack alignItems="center" padding={10} justifyContent="space-between" gap="$3">
          <Text fontWeight={500}>Pure black dark background</Text>
          <Switch
            borderWidth={2}
            borderColor={pureBlackBackground ? '$color' : '$color2'}
            size="$4"
            backgroundColor={pureBlackBackground ? '$color' : 'transparent'}
            checked={pureBlackBackground}
            onCheckedChange={setPureBlackBackground}>
            <Switch.Thumb
              borderWidth={0}
              scale={0.7}
              backgroundColor={pureBlackBackground ? '$color4' : '$color2'}
              animation="quick"
            />
          </Switch>
        </XStack>
      )}
    </ThemedView>
  );
};

export default Appearance;
