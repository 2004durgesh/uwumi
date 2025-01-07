import { ThemedView } from '@/components/ThemedView';
import { useAnimeTrending } from '@/hooks/queries';
import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Text, Card, Image, XStack, YStack, H3, ZStack, Spinner, styled, View } from 'tamagui';
import CardList from '@/components/CardList';
import { IAnimeResult } from '@/constants/types';

const index = () => {
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage } = useAnimeTrending();

  if (error) {
    console.log(error);
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="$color">Error: {error.message}</Text>
      </YStack>
    );
  }

  return (
    <ThemedView>
      <YStack gap="$2">
        <XStack gap="$2" alignItems="center">
          <H3 padding="$4" color="$color">
            Trending
          </H3>
          <H3 padding="$4" color="$color">
            Popular
          </H3>
        </XStack>
        {isLoading && !data ? (
          <XStack padding="$4" justifyContent="center">
            <Spinner size="large" color="$color" />
          </XStack>
        ) : (
          <CardList
            data={data}
            refetch={refetch}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
          />
        )}
      </YStack>
    </ThemedView>
  );
};

export default index;
