import { View, Text, YStack, XStack, Spinner } from "tamagui";
import { FlatList, TouchableOpacity } from "react-native";
import React,{Suspense} from "react";
import CustomImage from "@/components/CustomImage";
import { useAnimeEpisodes } from "@/queries";
import { useLocalSearchParams, Link } from "expo-router";

const LoadingState = () => (
  <YStack justifyContent="center" alignItems="center" minHeight={300}>
    <Spinner size="large" color="$color" />
  </YStack>
);

const EpisodeList = () => {
  const { mediaType, provider, id } = useLocalSearchParams<{
    mediaType: string;
    provider: string;
    id: string;
  }>();
  const { data: episodeData, isLoading } = useAnimeEpisodes({ id, provider });
  // console.log("ep", episodeData);
  // Transform episodes object to array and sort
  const episodesList = Array.isArray(episodeData) ? episodeData : [];
  if (isLoading) {
    return <LoadingState />;
  }
  return (
      <YStack gap={2}>
        <FlatList
          data={episodesList || []}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
            paddingVertical: 8,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <Link
              asChild
              href={{
                pathname: "/watch/[mediaType]",
                params: {
                  mediaType,
                  provider,
                  episodeId:item?.id,
                  episodeDubId:item?.dubId,
                  isDub: item?.isDub,
                  poster: item?.image,
                  title: item?.title,
                  description: item?.description,
                  number: item?.number,
                },
              }}
            >
              <TouchableOpacity onPress={() => console.log(item)}>
                <YStack gap={"$4"} padding={2}>
                  <XStack gap={"$4"}>
                    <View position="relative">
                      <CustomImage
                        source={item?.image}
                        style={{ width: 160, height: 107, bordeRadius: 4 }}
                      />
                      <View
                        position="absolute"
                        bottom="$1"
                        left="$1"
                        backgroundColor="$background"
                        opacity={0.8}
                        borderRadius="$4"
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                      >
                        <Text fontSize="$3" fontWeight="700" color="$color">
                          EP {item.number}
                        </Text>
                      </View>
                    </View>
                    <YStack padding={2} flex={1}>
                      <Text fontSize="$3" fontWeight="700" numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text
                        fontSize="$2.5"
                        color="$color2"
                        fontWeight="500"
                        numberOfLines={3}
                      >
                        {item?.description}
                      </Text>
                      <Text
                        width="50%"
                        alignSelf="flex-end"
                        fontSize="$2.5"
                        fontWeight="500"
                        color="$color2"
                        marginLeft="auto"
                      >
                        {new Date(item.airDate).toDateString()}
                      </Text>
                    </YStack>
                  </XStack>
                </YStack>
              </TouchableOpacity>
            </Link>
          )}
          keyExtractor={(item) => item.id.toString()} //just to be sure :)
        />
      </YStack>
  );
};

export default EpisodeList;
