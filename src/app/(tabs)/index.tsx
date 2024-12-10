import { ThemedView } from "@/components/ThemedView";
import { useAnimeTrending } from "@/queries";
import { Link } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import {
  Text,
  Card,
  Image,
  XStack,
  YStack,
  H3,
  ZStack,
  Spinner,
  styled,
  View,
} from "tamagui";
import Animated from "react-native-reanimated";
import { LinearGradient } from "tamagui/linear-gradient";

const StyledCard = styled(Card, {
  width: 150,
  height: 250,
  marginHorizontal: "$1",
  animation: "bouncy",
  variants: {
    isHovered: {
      true: {
        scale: 0.95,
        borderColor: "$color",
      },
    },
  },
});

const index = () => {
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage } =
    useAnimeTrending();

  if (error) {
    console.log(error);
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="$color">Error: {error.message}</Text>
      </YStack>
    );
  }

  const AnimeCard = ({ anime }: { anime: any }) => {
    return (
      <Link
        asChild
        href={{
          pathname: "/info/[source]",
          params: { source: "anime", provider: "gogoanime", id: anime.id },
        }}
      >
        <StyledCard
          elevate
          // bordered
          animation="bouncy"
          hoverStyle={{ scale: 0.95 }}
          pressStyle={{ scale: 0.9 }}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={3.84}
        >
          <Card.Footer paddingVertical="$5" paddingHorizontal="$1">
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              color="$color"
              fontSize="$3"
              fontWeight="500"
              margin={0}
              width={100}
            >
              {anime.title.romaji}
            </Text>
          </Card.Footer>
          <Card.Background>
            <ZStack width="100%" height="100%" alignItems="center">
              <Animated.Image
                source={{
                  width: 135,
                  height: 190,
                  uri: anime.image,
                }}
                style={{ borderRadius: 2 }}
                width={135}
                height={190}
                resizeMode="cover"
              />
              <LinearGradient
                width="100%"
                height="100%"
                colors={["rgba(0,0,0,0.8)", "transparent"]}
                start={[0, 1]}
                end={[0, 0.3]}
                borderRadius="$2"
                opacity={0.9}
              />
            </ZStack>
          </Card.Background>
        </StyledCard>
      </Link>
    );
  };

  return (
    <ThemedView>
      <YStack padding="$4" gap="$4">
        <H3 color="$color">Trending Now</H3>
        {isLoading && !data ? (
          <XStack padding="$4" justifyContent="center">
            <Spinner size="large" color="$color" />
          </XStack>
        ) : (
          <FlatList
            data={data?.pages.flatMap((page) => page.results) || []}
            renderItem={({ item }) => <AnimeCard anime={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              hasNextPage ? (
                <XStack padding="$4" justifyContent="center">
                  <Spinner size="small" color="$color" />
                </XStack>
              ) : null
            }
          />
        )}
      </YStack>
    </ThemedView>
  );
};

export default index;
