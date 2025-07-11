import { View, Theme, ViewProps } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore, useAccentStore, useCurrentTheme, usePureBlackBackground } from '@/hooks';
import { StatusBar, StatusBarProps } from 'expo-status-bar';

export type ThemedViewProps = {
  children?: React.ReactNode;
  useSafeArea?: boolean;
  useStatusBar?: boolean;
  statusBarProps?: StatusBarProps;
} & ViewProps;

export function ThemedView({
  children,
  useSafeArea = false, //becoz of edge-to-edge we wont be using safe area insets instead we will use paddingTop={insets.top} in the View component
  useStatusBar = true,
  statusBarProps,
  ...props
}: ThemedViewProps) {
  const themeName = useThemeStore((state) => state.themeName);
  const accentName = useAccentStore((state) => state.accentName);
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const currentTheme = useCurrentTheme();
  const insets = useSafeAreaInsets();

  // const content = (
  //   <View flex={1} backgroundColor={pureBlackBackground ? '#000' : '$background'} {...props}>
  //     {children}
  //   </View>
  // );
  // console.log(themeName,accentName,useTheme())

  return (
    <Theme name={accentName}>
      <View
        paddingTop={useSafeArea ? 0 : insets.top}
        flex={1}
        backgroundColor={pureBlackBackground ? '#000' : '$background'}
        {...props}>
        {children}
      </View>

      <StatusBar
        animated
        hideTransitionAnimation="slide"
        hidden={!useStatusBar}
        style={themeName === 'dark' ? 'light' : 'dark'}
        backgroundColor={pureBlackBackground ? '#000' : currentTheme?.background}
        {...statusBarProps}
      />
    </Theme>
  );
}
