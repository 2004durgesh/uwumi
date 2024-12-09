import {
  View,
  Text,
  ZStack,
  XStack,
  Image,
  YStack,
  styled,
  Paragraph,
  Tabs,
  Separator,
  SizableText,
  H5,
} from "tamagui";
import type { TabsContentProps } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { useAnimeInfo } from "@/queries";
import { ImageBackground } from "react-native";
import {
  ArrowLeft,
  Captions,
  CaptionsOff,
  Clock,
  Heart,
  Star,
} from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";

const Info = () => {
  const { service, provider, id } = useLocalSearchParams<{
    service: string;
    provider: string;
    id: string;
  }>();

  interface InfoItemProps {
    icon?: React.ElementType; // Make icon optional
    text: string | number;
  }

  const TitleText = styled(Text, {
    fontWeight: "900",
  });

  const InfoText = styled(Text, {
    fontSize: 14,
  });

  const InfoContainer = styled(XStack, {
    alignItems: "center",
    gap: 4,
  });

  const HorizontalTabs = () => {
    return (
      <Tabs
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        width={400}
        height={150}
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
        borderColor="$borderColor"
      >
        <Tabs.List
          // separator={<Separator vertical />}
          disablePassBorderRadius="bottom"
          aria-label="Manage your account"
        >
          <Tabs.Tab flex={1} value="tab1">
            <SizableText fontFamily="$body">Profile</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab2">
            <SizableText fontFamily="$body">Connections</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab3">
            <SizableText fontFamily="$body">Notifications</SizableText>
          </Tabs.Tab>
        </Tabs.List>
        <Separator />
        <Tabs.Content value="tab1">
          <H5>{data?.description}</H5>
        </Tabs.Content>

        <Tabs.Content value="tab2">
          <H5>Connections</H5>
        </Tabs.Content>

        <Tabs.Content value="tab3">
          <H5>Notifications</H5>
        </Tabs.Content>
      </Tabs>
    );
  };

  // Reusable info item component
  const InfoItem = ({ icon: Icon, text }: InfoItemProps) => (
    <InfoContainer>
      {Icon && <Icon size={16} />}
      <InfoText>{text}</InfoText>
    </InfoContainer>
  );

  const { data, isLoading } = useAnimeInfo({ id, provider });
  console.log(data);
  return (
    <>
      <ThemedView>
        <ZStack height={300}>
          <ImageBackground
            source={{ uri: data?.cover }}
            style={{ width: "100%", height: 300 }}
          />
          <View height={300}>
            <LinearGradient
              width="100%"
              height="300"
              colors={["black", "transparent"]}
              start={[0, 1]}
              end={[0, 0.5]}
              flex={1}
            />
          </View>
          <View padding={10}>
            <XStack justifyContent="space-between">
              <ArrowLeft />
              <Heart />
            </XStack>

            <XStack gap={10} alignItems="center">
              <Image source={{ uri: data?.image }} width={115} height={163} />
              <YStack paddingHorizontal={20} gap={8} flex={1}>
                <TitleText>{data?.title?.english}</TitleText>
                <InfoItem icon={Clock} text={data?.status} />

                <XStack justifyContent="space-between">
                  <InfoItem icon={Star} text={data?.rating} />
                  <InfoItem
                    icon={data?.subOrDub === "sub" ? Captions : CaptionsOff}
                    text={data?.subOrDub}
                  />
                  <InfoItem text={data?.type} />
                </XStack>
                <Text>
                  {new Date(
                    data?.nextAiringEpisode?.airingTime * 1000
                  ).toDateString()}
                </Text>
              </YStack>
            </XStack>
            <View marginTop={20}>
              <Text>Webview</Text>
            </View>
          </View>
        </ZStack>

        <YStack alignItems="center" marginTop={20}>
          <HorizontalTabs />
        </YStack>
      </ThemedView>
    </>
  );
};

export default Info;
