import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Spinner, View } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useMangaChapterRead } from '@/hooks';
import { FlashList } from '@shopify/flash-list';
import NoResults from '@/components/NoResults';
import CustomImage from '@/components/CustomImage';
import { Dimensions } from 'react-native';

const Read = () => {
  const { width } = Dimensions.get('window');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useMangaChapterRead({ id: id, provider: 'mangadex' });

  if (isLoading) {
    return (
      <ThemedView>
        <View flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$color" />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      <FlashList
        data={data}
        keyExtractor={(item) => item?.img}
        contentContainerStyle={{
          paddingVertical: 8,
        }}
        ListEmptyComponent={<NoResults />}
        estimatedItemSize={width * 1.4}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <View marginVertical="$2">
            <CustomImage
              source={{ uri: item?.img }}
              style={{
                width: width,
                height: width * 1.4,
              }}
              resizeMode="contain"
            />
          </View>
        )}
      />
    </ThemedView>
  );
};

export default Read;
