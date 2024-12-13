import { View, Text, YStack } from "tamagui";
import React from "react";
import { IAnimeInfo } from "@/constants/types";
import CardList from "@/components/CardList";

const Similar = ({data}:{data:IAnimeInfo}) => {
  return (
    <YStack gap={2}>
      <CardList data={data?.recommendations}/>
    </YStack>
  );
};

export default Similar;
