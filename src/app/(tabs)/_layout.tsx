import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { BookImage, Settings, TvMinimalPlay } from '@tamagui/lucide-icons';
import { BlurView } from 'expo-blur';
import { Stack, YStack } from 'tamagui';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 64,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarBackground: () => (
          <Stack
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            overflow="hidden"
            borderTopLeftRadius={20}
            borderTopRightRadius={20}>
            <BlurView
              intensity={80}
              tint="systemChromeMaterialDark"
              style={{
                ...StyleSheet.absoluteFillObject,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: 'transparent',
              }}
            />
            <YStack
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              backgroundColor="$background"
              opacity={0.7}
            />
          </Stack>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Anime',
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../../../assets/images/anime.png')
                  : require('../../../assets/images/anime-outlined.png')
              }
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="manga"
        options={{
          title: 'Manga',
          tabBarIcon: ({ focused }) => <BookImage />,
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: 'Movies',
          tabBarIcon: ({ focused }) => <TvMinimalPlay />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <Settings />,
        }}
      />
    </Tabs>
  );
}
