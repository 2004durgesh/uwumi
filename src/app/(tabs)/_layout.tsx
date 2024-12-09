import { Tabs } from "expo-router";
import React from "react";
import { Platform, Image, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BookImage, Settings, TvMinimalPlay } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          borderRadius: 20,
          marginBottom: 10,
          backgroundColor: "transparent",
          borderColor: "transparent",
          marginHorizontal: 20,
          height: 60,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => {
          return (
            <BlurView
              intensity={80}
              style={{
                ...StyleSheet.absoluteFillObject,
                borderRadius: 20,
                overflow: "hidden",
                backgroundColor: "transparent",
              }}
            />
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Anime",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../../assets/images/anime.png")
                  : require("../../../assets/images/anime-outlined.png")
              }
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="manga"
        options={{
          title: "Manga",
          tabBarIcon: ({ focused }) => <BookImage />,
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: "Movies",
          tabBarIcon: ({ focused }) => <TvMinimalPlay />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => <Settings />,
        }}
      />
    </Tabs>
  );
}
