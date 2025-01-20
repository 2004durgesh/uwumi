import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Text } from 'tamagui';

const Settings = () => {
  return (
    <ThemedView>
      <Text fontSize="$6" fontWeight="bold" marginBottom="$4">
        Settings
      </Text>
      {process.env.NODE_ENV && (
        <Text fontSize="$3" opacity={0.7}>
          Environment: {process.env.NODE_ENV}
        </Text>
      )}
    </ThemedView>
  );
};

export default Settings;
