import React, { memo } from 'react';
import { Check, ChevronDown } from '@tamagui/lucide-icons';
import { Adapt, Select, Sheet } from 'tamagui';
import { usePureBlackBackground } from '@/hooks';

type SelectOption = {
  name: string;
  value: string;
};

const CustomSelect = ({
  SelectItem,
  SelectLabel,
  value,
  onValueChange,
}: {
  SelectItem: SelectOption[];
  SelectLabel: string;
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const pureBlackBackground = usePureBlackBackground((state) => state.pureBlackBackground);
  const bgColor = pureBlackBackground ? '$color3' : 'black';
  return (
    <Select value={value} onValueChange={onValueChange}>
      <Select.Trigger backgroundColor={bgColor} width={150} iconAfter={ChevronDown}>
        <Select.Value width={90}>{SelectItem.find((opt) => opt.value === value)?.name || SelectLabel}</Select.Value>
      </Select.Trigger>

      <Adapt platform="touch">
        <Sheet snapPoints={[30]} modal dismissOnSnapToBottom animation="quick">
          <Sheet.Frame backgroundColor={bgColor}>
            <Sheet.ScrollView showsVerticalScrollIndicator>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.Viewport
          animation="quick"
          animateOnly={['transform', 'opacity']}
          enterStyle={{ x: 0, y: -10 }}
          exitStyle={{ x: 0, y: 10 }}
          minWidth={200}>
          <Select.Group>
            <Select.Label backgroundColor={bgColor}>{SelectLabel}</Select.Label>
            {SelectItem.map((item, index) => (
              <Select.Item backgroundColor={bgColor} key={item.value} index={index} value={item.value}>
                <Select.ItemText>{item.name}</Select.ItemText>
                <Select.ItemIndicator marginLeft="auto">
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
};

export default memo(CustomSelect);
