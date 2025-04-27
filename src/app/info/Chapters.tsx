import IconTitle from '@/components/IconTitle';
import NoResults from '@/components/NoResults';
import RippleButton from '@/components/RippleButton';
import { usePureBlackBackground } from '@/hooks';
import { FlashList } from '@shopify/flash-list';
import { Album, Library, ScrollText } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { IMangaChapter } from 'react-native-consumet';
import { Text, View, XStack, YStack } from 'tamagui';

const Chapters = ({ data }: { data?: IMangaChapter[] }) => {
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const IconProps = {
    size: 20,
    color: '$color1',
    opacity: 0.7,
  };
  const router = useRouter();
  return (
    <View height="100%">
      <FlashList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
        ListEmptyComponent={<NoResults />}
        ListFooterComponent={<View height={100} />}
        estimatedItemSize={150}
        showsVerticalScrollIndicator={true}
        estimatedFirstItemOffset={900}
        drawDistance={500}
        renderItem={({ item }) => (
          <RippleButton
            onPress={() => {
              router.push({
                pathname: '/read/[id]',
                params: {
                  id: item?.id,
                },
              });
            }}>
            <YStack gap={'$4'} padding={2} backgroundColor={pureBlackBackground ? '#000' : 'transparent'}>
              <XStack gap={'$4'}>
                <YStack padding={2} flex={1} justifyContent="space-between">
                  <YStack>
                    <XStack alignItems="center" justifyContent="space-between" gap={2}>
                      <Text fontSize="$3" fontWeight="700" numberOfLines={1} flex={1} color="$color">
                        {item.title}
                      </Text>
                      <XStack alignItems="center" gap={2}>
                        <IconTitle text={item.volumeNumber} icon={Library} iconProps={IconProps} />
                      </XStack>
                    </XStack>
                  </YStack>
                  <XStack justifyContent="space-between" alignItems="center">
                    <IconTitle text={item.chapterNumber} icon={Album} iconProps={IconProps} />
                    <IconTitle text={item.pages} icon={ScrollText} iconProps={IconProps} />
                  </XStack>
                </YStack>
              </XStack>
            </YStack>
          </RippleButton>
        )}
      />
    </View>
  );
};

export default Chapters;
