import { type ViewProps } from "react-native";
import { View, Theme, useTheme } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore, useAccentStore } from "@/stores";
import { StatusBar } from "expo-status-bar";

export type ThemedViewProps = {
  children?: React.ReactNode;
  useSafeArea?: boolean;
  useStatusBar?: boolean;
  otherProps?: ViewProps;
};

export function ThemedView({
  children,
  useSafeArea = true,
  useStatusBar = false,
  ...otherProps
}: ThemedViewProps) {
  const themeName = useThemeStore((state) => state.themeName);
  const accentName = useAccentStore((state) => state.accentName);
  const content = (
    <View flex={1} backgroundColor="$background" {...otherProps}>
      {children}
    </View>
  );
  console.log(themeName,accentName,useTheme())

  return (
    <Theme name={themeName}>
      <Theme name={accentName}>
        {useSafeArea ? (
          <SafeAreaView style={{ flex: 1, backgroundColor: "$background" }}>
            {content}
          </SafeAreaView>
        ) : (
          content
        )}
        <StatusBar
          animated
          hideTransitionAnimation="slide"
          hidden={useStatusBar}
          style={themeName === "dark" ? "light" : "dark"}
          backgroundColor={themeName === "dark" ? "black" : "white"}
        />
      </Theme>
    </Theme>
  );
}
