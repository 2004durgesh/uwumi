import {
  Tabs,
  YStack,
  XStack,
  Text,
  styled,
  AnimatePresence,
  ScrollView,
  Image,
  View,
} from "tamagui";
import React, { useMemo, useState } from "react";
import type { StackProps, TabLayout, TabsTabProps } from "tamagui";
import { FlatList, Pressable, TouchableOpacity } from "react-native";
import { useAnimeEpisodes } from "@/queries";
import { useLocalSearchParams } from "expo-router";
import { IAnimeInfo } from "@/constants/types";
import ReadMore from "@/components/ReadMore";

interface TabsProps {
  data?: IAnimeInfo;
}

const AnimatedYStack = styled(YStack, {
  flex: 1,
  x: 0,
  opacity: 1,
  animation: "quick",
  variants: {
    direction: {
      ":number": (direction) => ({
        enterStyle: {
          x: direction > 0 ? -25 : 25,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: direction < 0 ? -25 : 25,
          opacity: 0,
        },
      }),
    },
  } as const,
});

const TabsRovingIndicator = ({
  active,
  ...props
}: { active?: boolean } & StackProps) => (
  <YStack
    position="absolute"
    backgroundColor={active ? "$color" : "$color2"}
    opacity={active ? 0.9 : 0.5}
    animation="quick"
    enterStyle={{ opacity: 0 }}
    exitStyle={{ opacity: 0 }}
    {...(active && {
      backgroundColor: "$color",
      opacity: 0.6,
    })}
    {...props}
  />
);

const HorizontalTabs: React.FC<TabsProps> = ({ data }) => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { data: episodeData, isLoading } = useAnimeEpisodes({ id });
  // console.log("ep", episodeData);
  // Transform episodes object to array and sort
  const episodesList = React.useMemo(() => {
    if (!episodeData?.episodes) return [];

    return Object.entries(episodeData.episodes)
      .map(([key, episode]) => {
        return {
          id: episode.tvdbId?.toString() || "",
          number: parseInt(key),
          title:
            episode.title?.en ||
            episode.title?.["x-jat"] ||
            episode.title?.ja ||
            episode.episode || // Fallback to episode field
            `Episode ${key}`, // Final fallback
          image: episode.image || "",
          description: episode.overview || "",
          airDate: episode.airDate || "",
        };
      })
      .filter(
        (episode) =>
          (!isNaN(episode.number) || episode.number == undefined) &&
          episode.image !== undefined &&
          episode.image !== null &&
          episode.image !== ""
      )
      .sort((a, b) => a.number - b.number);
  }, [episodeData]);

  const [tabState, setTabState] = useState<{
    currentTab: string;
    intentAt: TabLayout | null;
    activeAt: TabLayout | null;
    prevActiveAt: TabLayout | null;
  }>({
    currentTab: "tab1",
    intentAt: null,
    activeAt: null,
    prevActiveAt: null,
  });

  const { currentTab, intentAt, activeAt, prevActiveAt } = tabState;

  // Calculate direction for animation
  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0;
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1;
  })();

  const handleOnInteraction: TabsTabProps["onInteraction"] = (type, layout) => {
    if (type === "select") {
      setTabState((prev) => ({
        ...prev,
        prevActiveAt: prev.activeAt,
        activeAt: layout,
      }));
    } else {
      setTabState((prev) => ({ ...prev, intentAt: layout }));
    }
  };

  return (
    <Tabs
      value={tabState.currentTab}
      onValueChange={(value) =>
        setTabState((prev) => ({ ...prev, currentTab: value }))
      }
      orientation="horizontal"
      size="$4"
      height={"100%"}
      width={"100%"}
      flexDirection="column"
      activationMode="manual"
      borderRadius="$4"
    >
      <YStack>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              width={intentAt.width}
              height="$0.5"
              x={intentAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              active
              width={activeAt.width}
              height="$0.5"
              x={activeAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>

        <Tabs.List
          disablePassBorderRadius
          loop={false}
          aria-label="Content tabs"
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          paddingBottom="$1.5"
          borderColor="$color3"
          borderBottomWidth="$0.5"
          backgroundColor="transparent"
        >
          <Tabs.Tab
            flex={1}
            paddingHorizontal="$3"
            paddingVertical="$2"
            value="tab1"
            onInteraction={handleOnInteraction}
          >
            <Text
              fontWeight={currentTab === "tab1" ? "800" : "400"}
              color={currentTab === "tab1" ? "$color" : "$color2"}
            >
              Episodes
            </Text>
          </Tabs.Tab>
          <Tabs.Tab
            flex={1}
            paddingHorizontal="$3"
            paddingVertical="$2"
            value="tab2"
            onInteraction={handleOnInteraction}
          >
            <Text
              fontWeight={currentTab === "tab2" ? "800" : "400"}
              color={currentTab === "tab2" ? "$color" : "$color2"}
            >
              Details
            </Text>
          </Tabs.Tab>
          <Tabs.Tab
            flex={1}
            paddingHorizontal="$3"
            paddingVertical="$2"
            value="tab3"
            onInteraction={handleOnInteraction}
          >
            <Text
              fontWeight={currentTab === "tab3" ? "800" : "400"}
              color={currentTab === "tab3" ? "$color" : "$color2"}
            >
              Similar
            </Text>
          </Tabs.Tab>
        </Tabs.List>
      </YStack>

      <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
        <AnimatedYStack key={currentTab}>
          <Tabs.Content value={currentTab} forceMount justifyContent="center">
            {currentTab === "tab1" && (
              <YStack gap={2}>
                <FlatList
                  data={episodesList || []}
                  contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    flexGrow: 1,
                  }}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => console.log(item)}>
                      <YStack gap={"$4"} padding={2}>
                        <XStack gap={"$4"}>
                          <View position="relative">
                            <Image
                              source={{ uri: item?.image }}
                              width={160}
                              height={107}
                              borderRadius="$1"
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
                              <Text
                                fontSize="$3"
                                fontWeight="700"
                                color="$color"
                              >
                                EP {item.number}
                              </Text>
                            </View>
                          </View>
                          <YStack padding={2} flex={1}>
                            <Text
                              fontSize="$3"
                              fontWeight="700"
                              numberOfLines={2}
                            >
                              {item.title}
                            </Text>
                            <Text
                              fontSize="$2.5"
                              fontWeight="500"
                              color="$color2"
                            >
                              {new Date(item.airDate).toDateString()}
                            </Text>
                            <Text
                              fontSize="$2.5"
                              color="$color2"
                              fontWeight="500"
                              numberOfLines={3}
                            >
                              {item?.description}
                            </Text>
                          </YStack>
                        </XStack>
                      </YStack>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()} //just to be sure :)
                />
              </YStack>
            )}
            {/* done working on tab1 */}
            {currentTab === "tab2" && (
              <YStack gap={2}>
                <ScrollView
                  contentContainerStyle={{
                    padding: 16,
                    flexGrow: 1,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  <ReadMore>
                    {data?.description?.replace(/<[^>]*>/g, "")}
                  </ReadMore>
                  <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi culpa placeat cum animi repellat modi voluptatum dolore, vitae, quam aut perferendis quidem iusto ipsam totam quae ducimus suscipit illo corrupti nobis eum enim blanditiis tempora quaerat provident. Reprehenderit esse quam facere illo unde maiores suscipit molestiae labore. Nobis, obcaecati harum?</Text>
                </ScrollView>
              </YStack>
            )}
            {currentTab === "tab3" && (
              <YStack gap={2}>
                {data?.relations?.map((relation, index) => (
                  <Text key={index}>{index}</Text>
                ))}
              </YStack>
            )}
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  );
};

export default HorizontalTabs;
