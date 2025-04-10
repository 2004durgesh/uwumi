import { View, Theme, ViewProps } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  useSafeArea = true,
  useStatusBar = false,
  statusBarProps,
  ...props
}: ThemedViewProps) {
  const themeName = useThemeStore((state) => state.themeName);
  const accentName = useAccentStore((state) => state.accentName);
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const currentTheme = useCurrentTheme();

  const content = (
    <View flex={1} backgroundColor={pureBlackBackground ? '#000' : '$background'} {...props}>
      {children}
    </View>
  );
  // console.log(themeName,accentName,useTheme())

  return (
    <Theme name={accentName}>
      {useSafeArea ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: pureBlackBackground ? '#000' : '$background' }}>
          {content}
        </SafeAreaView>
      ) : (
        content
      )}
      <StatusBar
        animated
        hideTransitionAnimation="slide"
        hidden={useStatusBar}
        style={themeName === 'dark' ? 'light' : 'dark'}
        backgroundColor={pureBlackBackground ? '#000' : currentTheme?.background}
        {...statusBarProps}
      />
    </Theme>
  );
}
