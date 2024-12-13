import { MotiView } from "moti";
import { LinearGradient } from "tamagui/linear-gradient";
import { Text, Stack, View, YStack, XStack, styled, ZStack, ScrollView } from "tamagui";
import { TouchableOpacity } from "react-native";
import { ChevronDown } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { IAnimeInfo } from "@/constants/types";
import { WebView } from "react-native-webview";
import { useThemeStore } from "@/stores";

type DetailsProps = {
  data?: IAnimeInfo;
  previewLines?: number;
  lineHeight?: number;
};

const StatisticsXStack = styled(XStack, {
  flex: 1,
  justifyContent: "space-between",
});

const StatisticItem = ({ label, value }: { label: string; value: string }) => (
  <StatisticsXStack>
    {value && (
      <>
        <Text fontSize="$4" fontWeight={700} color="$color2">
          {label}
        </Text>
        <Text fontSize="$4" fontWeight={700} color="$color">
          {value}
        </Text>
      </>
    )}
  </StatisticsXStack>
);

const Details: React.FC<DetailsProps> = ({
  data,
  previewLines = 3,
  lineHeight = 20,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
    const themeName = useThemeStore((state: any) => state.themeName);
  

  return (
    <YStack gap={2}>
      <ScrollView
      contentContainerStyle={{
        padding: 16,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      >
        <View>
          <View>
            <View marginTop="$2">
              <View
                onLayout={(event) =>
                  setContentHeight(event.nativeEvent.layout.height)
                }
              >
                <Text
                  color="$color1"
                  paddingHorizontal="$2"
                  lineHeight="$3.5"
                  textAlign="justify"
                >
                  {data?.description}
                </Text>
              </View>
            </View>
            <View height="100%">
              {/* Animated description view */}
              <MotiView
                from={{
                  translateY: -contentHeight,
                }}
                animate={{
                  translateY: isExpanded ? 0 : -contentHeight + lineHeight,
                }}
                transition={{
                  type: "timing",
                  duration: 500,
                }}
                style={{
                  overflow: "hidden",
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                }}
              >
                <LinearGradient
                  locations={[0, 0.05, 0.1]}
                  colors={themeName==="dark"?[
                    "rgba(0, 0, 0, 0.5)",
                    "rgba(0, 0, 0, 0.7)",
                    "rgba(0, 0, 0, 1)",
                  ]:[
                    "rgba(255, 255, 255, 0.5)",
                    "rgba(255, 255, 255, 0.7)",
                    "rgba(255, 255, 255, 1)",
                  ]}
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 0.1 }}
                  style={{ height: "100%", width: "100%" }}
                >
                  <View>
                    {/* Animated icon rotation */}
                    <MotiView
                      style={{ alignItems: "center", padding: 8 }}
                      from={{
                        rotate: "180deg",
                      }}
                      animate={{
                        rotate: isExpanded ? "180deg" : "0deg",
                      }}
                      transition={{
                        type: "timing",
                        duration: 500,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setIsExpanded(!isExpanded)}
                      >
                        <ChevronDown size={24} color="$color" />
                      </TouchableOpacity>
                    </MotiView>
                    <YStack flex={1} height="100%" width="100%" gap="$2">
                      <StatisticItem label="Type" value={data?.type || ""} />
                      <StatisticItem
                        label="Country"
                        value={data?.countryOfOrigin || ""}
                      />
                      <StatisticItem
                        label="Season"
                        value={`${data?.season}, ${data?.releaseDate}`}
                      />
                      <StatisticItem
                        label="Duration"
                        value={`${data?.duration}m`}
                      />
                      <YStack height={200} position="relative">
                        <ZStack height={200}>
                          <WebView
                            bounces={false}
                            scrollEnabled={false}
                            originWhitelist={["*"]}
                            source={{
                              html: `
                                <html>
                                  <head>
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                                    <style>
                                      * { margin: 0; padding: 0; overflow: hidden; }
                                      body { width: 100vw; height: 100vh; }
                                      iframe { width: 100%; height: 100%; border: 0; }
                                    </style>
                                  </head>
                                  <body>
                                    <iframe
                                      src="https://www.youtube.com/embed/${data?.trailer?.id}"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowfullscreen>
                                    </iframe>
                                  </body>
                                </html>
                              `,
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                          <View width="100%" height="100%" />
                        </ZStack>
                      </YStack>
                    </YStack>
                  </View>
                </LinearGradient>
              </MotiView>
            </View>
          </View>
        </View>
      </ScrollView>
    </YStack>
  );
};

export default Details;
