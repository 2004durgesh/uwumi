import React from 'react';
import { Text, YStack } from 'tamagui';

const ListEmpty = () => {
  return (
    <YStack alignItems="center" justifyContent="center" minHeight={500} minWidth="100%">
      <Text fontSize={46} fontWeight={500} textAlign="center" color="$color2">
        Σ(ಠ_ಠ)
      </Text>
      <Text fontSize={16} color="$color2">
        No results found
      </Text>
    </YStack>
  );
};

export default ListEmpty;
