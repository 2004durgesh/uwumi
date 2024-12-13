import { type ViewProps } from "react-native";
import { View, Theme, useTheme } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import useAccentStore from "@/stores/useAccentStore";

export type ThemedViewProps = {
  children?: React.ReactNode;
  useSafeArea?: boolean;
  otherProps?: ViewProps;
};

export function ThemedView({
  children,
  useSafeArea = true,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();
  console.log(theme);
  const accentName = useAccentStore((state: any) => state.accentName);
  const content = (
    <View flex={1} backgroundColor="$background" {...otherProps}>
      {children}
    </View>
  );

  return (
    <Theme name="light">
      <Theme name={accentName}>
        {useSafeArea ? (
          <SafeAreaView style={{ flex: 1, backgroundColor: "$background" }}>
            {content}
          </SafeAreaView>
        ) : (
          content
        )}
      </Theme>
    </Theme>
  );
}
