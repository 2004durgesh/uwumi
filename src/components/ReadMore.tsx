import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { TamaguiProvider, Text, Stack, Button, AnimatePresence } from 'tamagui';

type ReadMoreProps = {
  children: React.ReactNode;
  previewLines?: number;
  lineHeight?: number;
  animationDuration?: number;
};

const ReadMore: React.FC<ReadMoreProps> = ({
  children,
  previewLines = 3,
  lineHeight = 20,
  animationDuration = 300,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Stack gap="$2" padding="$4">
      <AnimatePresence>
        <Stack
          animation="bouncy"
          enterStyle={{
            height: isExpanded ? undefined : previewLines * lineHeight,
            overflow: 'hidden',
          }}
          exitStyle={{ height: previewLines * lineHeight }}
          style={{ overflow: 'hidden' }}
          animate={{
            height: isExpanded ? 'auto' : previewLines * lineHeight,
          }}
          transition={{ type: 'timing', duration: animationDuration }}
        >
          <Text
            fontSize="$3"
            lineHeight={lineHeight}
            numberOfLines={isExpanded ? undefined : previewLines}
          >
            {children}
          </Text>
        </Stack>
      </AnimatePresence>

      <Button
        alignSelf="flex-start"
        size="$3"
        onPress={toggleExpanded}
        icon={isExpanded ? ChevronUp : ChevronDown}
        backgroundColor="$backgroundHover"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </Button>
    </Stack>
  );
};


export default ReadMore;
