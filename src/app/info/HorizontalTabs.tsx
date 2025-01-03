import {
  Tabs,
  YStack,
  Text,
  styled,
  AnimatePresence,
} from "tamagui";
import React, { useState } from "react";
import type { StackProps, TabLayout, TabsTabProps } from "tamagui";
import { IAnimeInfo } from "@/constants/types";
import Details from "@/app/info/Details";
import Similar from "./Similar";
import EpisodeList from "./EpisodeList";
interface TabsProps {
  data: IAnimeInfo;
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
            {currentTab === "tab1" && <EpisodeList />}

            {currentTab === "tab2" && <Details data={data} />}

            {currentTab === "tab3" && <Similar data={data} />}
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  );
};

export default HorizontalTabs;
