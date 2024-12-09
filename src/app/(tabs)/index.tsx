import { ThemedView } from "@/components/ThemedView";
import { useAnimeTrending } from "@/queries";
import { Link } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import {
  Text,
  Theme,
  Button,
  Card,
  H2,
  Image,
  Paragraph,
  XStack,
  H6,
  ZStack,
} from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

const index = () => {
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage } =
    useAnimeTrending();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  const AnimeCard = ({ anime }: { anime: any }) => {
    return (
      <Link asChild href={{
        pathname: '/info/[id]',
        params: { source: 'anime', provider: 'gogoanime', id: anime.id },
        
      }}>
        <Card
          width={150}
          height={250}
          bordered
          elevate
          margin={4}
          animation="bouncy"
          size="$4"
          // scale={0.9}
          hoverStyle={{ scale: 0.9 }}
          pressStyle={{ scale: 0.8 }}
        >
          <Card.Footer>
            <Card.Header>
              <Text numberOfLines={2} ellipsizeMode="tail" width={120}>
                {anime.title.romaji}
              </Text>
            </Card.Header>
          </Card.Footer>
          <Card.Background>
            <ZStack width={200} maxWidth={150} flex={1} alignItems="center">
              <Image
                source={{
                  width: 135,
                  height: 190,
                  uri: anime.image,
                }}
                objectFit="contain"
                flex={1}
                borderRadius={8}
              />
              <LinearGradient
                width="135"
                height="190"
                colors={["black", "transparent"]}
                start={[0, 1]}
                end={[0, 0.5]}
                flex={1}
              />
            </ZStack>
          </Card.Background>
        </Card>
      </Link>
    );
  };

  return (
    <ThemedView>
      <FlatList
        data={data?.pages.flatMap((page) => page.results) || []}
        renderItem={({ item }) => <AnimeCard anime={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5} // Adjust this value as needed
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
      />
    </ThemedView>
  );
};

export default index;
