import React, { useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text, YStack, XStack, Separator, Card, Theme } from 'tamagui';
import { Github, ExternalLink, CheckCircle2, AlertCircle } from '@tamagui/lucide-icons';
import CustomImage from '@/components/CustomImage';
import { useUpdateChecker } from '@/hooks/useUpdateChecker';
import RippleButton from '@/components/RippleButton';
import { openBrowserAsync } from 'expo-web-browser';
const About = () => {
  const { checkForUpdates, updateInfo } = useUpdateChecker();
  useEffect(() => {
    checkForUpdates(`https://api.github.com/repos/2004durgesh/uwumi/releases/latest`);
  }, [checkForUpdates]);

  const hasNewVersion = !updateInfo.isNewVersionPreRelease && updateInfo.newVersion !== updateInfo.currentVersion;

  return (
    <ThemedView>
      <YStack padding="$4" gap="$6">
        <YStack alignItems="center" gap="$2">
          <CustomImage
            source={require('../../../assets/images/icon.png')}
            alt="Logo"
            style={{ width: 100, height: 100, borderRadius: 20 }}
          />
        </YStack>

        <Separator />

        <Card elevation="$2" padding="$4" borderRadius="$4">
          <YStack gap="$3">
            <XStack gap="$2" alignItems="center">
              <CheckCircle2 size={18} color="$color" />
              <Text fontSize="$5" fontWeight="600">
                Version Information
              </Text>
            </XStack>

            <YStack gap="$1" paddingLeft="$2">
              <Text color="$color1" fontSize="$3">
                Current Version
              </Text>
              <Text fontSize="$4" fontWeight="500">
                {`${updateInfo.currentVersion} (${new Date(updateInfo.createdAt).toLocaleDateString()})`}
              </Text>
            </YStack>

            {hasNewVersion && (
              <Theme>
                <Card backgroundColor="$background" borderRadius="$3" padding="$3" marginTop="$2">
                  <YStack gap="$1">
                    <XStack gap="$2" alignItems="center">
                      <AlertCircle size={16} color="$color" />
                      <Text fontSize="$3" fontWeight="600" color="$color">
                        Update Available
                      </Text>
                    </XStack>
                    <Text fontSize="$4" fontWeight="500">
                      {`Version ${updateInfo.newVersion}`}
                    </Text>
                  </YStack>
                </Card>
              </Theme>
            )}
          </YStack>
        </Card>

        <YStack gap="$4" alignItems="center" marginTop="$2">
          <XStack gap="$4" justifyContent="center">
            <Theme>
              <RippleButton onPress={() => openBrowserAsync('https://github.com/2004durgesh/uwumi')}>
                <XStack gap="$2" alignItems="center">
                  <Github size={20} />
                  <Text fontWeight="600">GitHub</Text>
                </XStack>
              </RippleButton>

              {hasNewVersion && (
                <RippleButton onPress={() => openBrowserAsync('https://github.com/2004durgesh/uwumi/releases/latest')}>
                  <XStack gap="$2" alignItems="center">
                    <ExternalLink size={20} />
                    <Text fontWeight="600">Update</Text>
                  </XStack>
                </RippleButton>
              )}
            </Theme>
          </XStack>
        </YStack>
      </YStack>
    </ThemedView>
  );
};

export default About;
