import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Stack, View } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { ChevronDown } from '@tamagui/lucide-icons';
import React, { useState } from 'react';

type ReadMoreProps = {
  children: string;
  previewLines?: number;
  lineHeight?: number;
};

const ReadMore: React.FC<ReadMoreProps> = ({
  children,
  previewLines = 3,
  lineHeight = 20,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  return (
    <Stack gap="$2" padding="$2">
      <View position="relative">
        <MotiView
          from={{ height: previewLines * lineHeight }}
          animate={{ 
            height: isExpanded ? contentHeight : previewLines * lineHeight 
          }}
          transition={{
            type: 'timing',
            duration: 500,
          }}
          style={{ overflow: 'hidden' }}
        >
          <Text
            onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
            fontSize="$4"
            lineHeight={lineHeight}
            color="$color"
          >
            {children}
          </Text>

          {!isExpanded && (
            <LinearGradient
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 50,
              }}
              locations={[0, 0.05, 0.1]}
              colors={[
                'rgba(0,0,0,0)',
                'rgba(0,0,0,0.7)',
                'rgba(0,0,0,1)'
              ]}
            />
          )}
        </MotiView>

        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <MotiView
            animate={{
              rotate: isExpanded ? '180deg' : '0deg',
            }}
            transition={{
              type: 'timing',
              duration: 300,
            }}
            style={{ alignItems: 'center', padding: 8 }}
          >
            <ChevronDown size={24} color="$color" />
          </MotiView>
        </TouchableOpacity>
      </View>
    </Stack>
  );
};

export default ReadMore;