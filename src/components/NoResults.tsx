import React from 'react';
import { Text, YStack } from 'tamagui';

const KAOMOJI = [
  'Σ(ಠ_ಠ)',
  '(´･_･`)',
  '(╥﹏╥)',
  '(；一_一)',
  '(┬┬﹏┬┬)',
  '(－‸ლ)',
  '(｡•́︿•̀｡)',
  '(╯°□°）╯',
  '(⊙_⊙;)',
  'ヽ(°〇°)ﾉ',
];

const NoResults = () => {
  const randomKaomoji = KAOMOJI[Math.floor(Math.random() * KAOMOJI.length)];

  return (
    <YStack padding="$4" alignItems="center" justifyContent="center" gap="$4">
      <Text fontSize={46} fontWeight={500} textAlign="center" color="$color2">
        {randomKaomoji}
      </Text>
      <Text fontSize={16} color="$color2">
        No results found
      </Text>
    </YStack>
  );
};

export default NoResults;
