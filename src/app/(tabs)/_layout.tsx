import { Tabs } from 'expo-router';
import React, { useMemo, useCallback, useEffect } from 'react';
import { BookImage, Ellipsis, TvMinimalPlay } from '@tamagui/lucide-icons';
import { View } from 'tamagui';
import { useThemeStore, useCurrentTheme, usePureBlackBackground } from '@/hooks';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import AnimeIcon from '@/components/SVG/AnimeIcon';
import TVFocusWrapper, { isTV } from '@/components/TVFocusWrapper';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function TabLayout() {
  const themeName = useThemeStore((state) => state.themeName);
  const currentTheme = useCurrentTheme();
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);

  // Only update navigation bar when theme changes
  useEffect(() => {
    if (!isTV) {
      SystemNavigationBar.setNavigationColor(
        pureBlackBackground ? currentTheme?.color5 : currentTheme?.color3 || 'black',
      );
    }
  }, [currentTheme?.color3, currentTheme?.color5, pureBlackBackground]);

  // Memoize TabBarCapsule component
  const TabBarCapsule = useCallback(
    ({ focused, children }: { focused: boolean; children: React.ReactNode }) => {
      if (!isTV) {
        return (
          <View
            width={focused ? 70 : 30}
            height={30}
            alignItems="center"
            justifyContent="center"
            borderRadius={100}
            animation="quick"
            backgroundColor={focused ? currentTheme?.color4 : 'transparent'}>
            {children}
          </View>
        );
      } else {
        return <View>{children}</View>;
      }
    },
    [currentTheme?.color4],
  );

  // Memoize tab configuration
  const tabConfig = useMemo(
    () => [
      {
        name: 'index',
        title: 'Anime',
        icon: (color: string) => <AnimeIcon color={color} />,
      },
      {
        name: 'manga',
        title: 'Manga',
        icon: (color: string) => <BookImage color={color} />,
      },
      {
        name: 'movies',
        title: 'Movies',
        icon: (color: string) => <TvMinimalPlay color={color} />,
      },
      {
        name: 'more',
        title: 'More',
        icon: (color: string) => <Ellipsis color={color} />,
      },
    ],
    [],
  );

  // Memoize screen options
  const screenOptions = useCallback(
    ({ route }: { route: any }) => {
      const currentTab = tabConfig.find((tab) => tab.name === route.name);
      const tabIndex = currentTab ? tabConfig.indexOf(currentTab) : 0;

      return {
        headerShown: false,
        animation: 'shift',
        tabBarVariant: isTV ? 'material' : 'uikit',
        tabBarPosition: isTV ? 'left' : 'bottom',
        tabBarActiveTintColor: themeName === 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: themeName === 'dark' ? '#ccc' : '#333',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: isTV ? 15 : 13,
          fontWeight: 'bold',
        },
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          height: isTV ? '100%' : 64,
          width: isTV ? '10%' : '100%',
          backgroundColor: pureBlackBackground ? currentTheme?.color5 : currentTheme?.color3,
          alignItems: 'center',
        },
        tabBarButton: (props: any) => {
          if (isTV) {
            return (
              <TVFocusWrapper
                isFocusable={true}
                hasTVPreferredFocus={tabIndex === 0}
                onPress={props.onPress}
                nextFocusDown={tabIndex < tabConfig.length - 1 ? undefined : 0}
                nextFocusUp={tabIndex > 0 ? undefined : 0}
                nextFocusRight={0}
                nextFocusLeft={0}
                style={{ flex: 1 }}>
                <View {...props} />
              </TVFocusWrapper>
            );
          }
          return <View {...props} />;
        },
      };
    },
    [themeName, currentTheme, pureBlackBackground, tabConfig],
  );

  // Memoize tab bar icon function
  const getTabBarIcon = useCallback(
    (tab: any) =>
      ({ focused, color }: { focused: boolean; color: string }) => (
        <TabBarCapsule focused={focused}>{tab.icon(color)}</TabBarCapsule>
      ),
    [TabBarCapsule],
  );

  return (
    <Tabs screenOptions={screenOptions}>
      {tabConfig.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: getTabBarIcon(tab),
            tabBarItemStyle: isTV ? { height: 60 } : undefined,
          }}
        />
      ))}
    </Tabs>
  );
}
