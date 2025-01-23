import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
import { BookImage, Ellipsis, TvMinimalPlay } from '@tamagui/lucide-icons';
import { View } from 'tamagui';
import { useThemeStore, useCurrentTheme } from '@/hooks';
import SystemNavigationBar from 'react-native-system-navigation-bar';

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};
const TabBarCapsule = ({
  focused,
  color,
  children,
}: {
  focused: boolean;
  color?: string;
  children: React.ReactNode;
}) => {
  return (
    <View
      width={focused ? 70 : 30}
      height={30}
      alignItems="center"
      justifyContent="center"
      borderRadius={100}
      animation="quick"
      backgroundColor={focused ? '$color4' : 'transparent'}>
      {children}
    </View>
  );
};

export default function TabLayout() {
  const themeName = useThemeStore((state) => state.themeName);
  const currentTheme = useCurrentTheme();
  // console.log(currentTheme, 'tabs');
  SystemNavigationBar.setNavigationColor(currentTheme?.color3 || 'black');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarActiveTintColor: themeName === 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: themeName === 'dark' ? '#ccc' : '#333',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: 'bold',
        },
        tabBarStyle: {
          height: 64,
          backgroundColor: currentTheme?.color3,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Anime',
          tabBarIcon: ({ focused }) => (
            <TabBarCapsule focused={focused}>
              <Image
                source={
                  focused
                    ? require('../../../assets/images/anime.png')
                    : require('../../../assets/images/anime-outlined.png')
                }
                style={{ width: 30, height: 30 }}
              />
            </TabBarCapsule>
          ),
        }}
      />
      <Tabs.Screen
        name="manga"
        options={{
          title: 'Manga',
          tabBarIcon: ({ focused, color }) => (
            <TabBarCapsule focused={focused} color={color}>
              <BookImage color={color} />
            </TabBarCapsule>
          ),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: 'Movies',
          tabBarIcon: ({ focused, color }) => (
            <TabBarCapsule focused={focused} color={color}>
              <TvMinimalPlay color={color} />
            </TabBarCapsule>
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ focused, color }) => (
            <TabBarCapsule focused={focused} color={color}>
              <Ellipsis color={color} />
            </TabBarCapsule>
          ),
        }}
      />
    </Tabs>
  );
}
