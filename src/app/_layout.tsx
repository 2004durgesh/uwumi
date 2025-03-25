import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider, Theme, Dialog, Unspaced, XStack, Text, YStack, Button, Separator } from 'tamagui';
import { X, Download, ArrowUpCircle } from '@tamagui/lucide-icons';
import { PortalProvider } from '@tamagui/portal';
import { Toaster } from 'sonner-native';
import config from '../../tamagui.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Inter_500Medium as InterMedium,
  Inter_600SemiBold as InterSemiBold,
  Inter_800ExtraBold as InterBold,
} from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeStore, useAccentStore } from '@/hooks';
import pkg from '../../package.json';
import axios from 'axios';
import { compareVersions } from '@/constants/utils';
import * as WebBrowser from 'expo-web-browser';
import * as Orientation from 'expo-screen-orientation';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

interface DownloadDialogProps {
  currentVersion: string;
  newVersion: string;
  updateType: string;
  showUpdateDialog: boolean;
  setShowUpdateDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DownloadDialog = ({
  currentVersion,
  newVersion,
  updateType,
  showUpdateDialog,
  setShowUpdateDialog,
}: DownloadDialogProps) => {
  const accentName = useAccentStore((state) => state.accentName);
  return (
    <Theme name={accentName}>
      <Dialog modal open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            backgroundColor="rgba(0,0,0,0.5)"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            width="85%"
            maxWidth={400}
            padding="$5"
            borderRadius="$6"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ opacity: 0, scale: 0.95 }}
            exitStyle={{ opacity: 0, scale: 0.95 }}
            gap="$4">
            <YStack alignItems="center" marginTop="$2" marginBottom="$2">
              <ArrowUpCircle size={48} color={'$color'} opacity={0.9} />
            </YStack>
            <Dialog.Title textAlign="center" fontSize={13} fontWeight="700">
              New Version Available
            </Dialog.Title>
            <XStack justifyContent="center" gap="$4" paddingVertical="$2">
              <YStack alignItems="center">
                <Text fontSize={16}>Current</Text>
                <Text fontWeight="600">{currentVersion}</Text>
              </YStack>
              <Separator vertical />
              <YStack alignItems="center">
                <Text fontSize={16}>New</Text>
                <Text fontWeight="600">{newVersion}</Text>
              </YStack>
            </XStack>
            <Dialog.Description textAlign="center" paddingHorizontal="$2">
              {updateType} is now available.
            </Dialog.Description>
            <YStack gap="$3" marginTop="$2">
              <Button
                themeInverse
                icon={Download}
                fontSize={18}
                fontWeight="600"
                borderRadius="$4"
                onPress={async () => {
                  await WebBrowser.openBrowserAsync('https://github.com/2004durgesh/uwumi/releases/latest');
                }}>
                Update Now
              </Button>
              <Button variant="outlined" fontSize={18} borderRadius="$4" onPress={() => setShowUpdateDialog(false)}>
                Not Now
              </Button>
            </YStack>
            <Unspaced>
              <Dialog.Close asChild>
                <Button position="absolute" top="$3" right="$3" size="$2" circular icon={X} opacity={0.7} />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </Theme>
  );
};

export default function RootLayout() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateChecked, setIsUpdateChecked] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({
    currentVersion: pkg.version,
    newVersion: '',
    updateType: '',
  });

  //when tv set orientation to landscape
  useEffect(() => {
    Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE);
  }, []);
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const { data } = await axios.get(`https://api.github.com/repos/2004durgesh/uwumi/releases`);
        const localVersion = pkg.version;
        const remoteVersion = data[0].tag_name.replace('v', '');

        // Get update type
        const updateType = compareVersions(localVersion, remoteVersion);

        // Set update available if it's not "No update available"
        const hasUpdate = !updateType.includes('No update');

        setUpdateInfo({
          currentVersion: localVersion,
          newVersion: remoteVersion,
          updateType,
        });

        setIsUpdateAvailable(hasUpdate);
        setIsUpdateChecked(true);
      } catch (error) {
        console.log(error);
        setIsUpdateChecked(true); // Still mark as checked even on error
      }
    };

    checkForUpdates();
  }, []);
  const [loaded] = useFonts({
    InterMedium,
    InterSemiBold,
    InterBold,
  });
  const themeName = useThemeStore((state) => state.themeName);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retryDelay: 1000,
      },
    },
  });
  useEffect(() => {
    if (loaded && isUpdateChecked) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isUpdateChecked]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <PortalProvider>
            <Theme name={themeName}>
              <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="info/[mediaType]" />
                <Stack.Screen name="watch/[mediaType]" />
                <Stack.Screen name="read/[id]" />
                <Stack.Screen name="(settings)" />
                <Stack.Screen name="+not-found" />
              </Stack>
              {isUpdateAvailable && (
                <DownloadDialog
                  currentVersion={updateInfo.currentVersion}
                  newVersion={updateInfo.newVersion}
                  updateType={updateInfo.updateType}
                  showUpdateDialog={isUpdateAvailable}
                  setShowUpdateDialog={setIsUpdateAvailable}
                />
              )}
            </Theme>
          </PortalProvider>
          <Toaster
            position="bottom-center"
            invert
            autoWiggleOnUpdate="always"
            richColors
            swipeToDismissDirection="left"
          />
        </TamaguiProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
