import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { View, Text, YStack, XStack, styled } from 'tamagui';
import { Modal, BackHandler, FlatList, Pressable } from 'react-native';
import { useCurrentTheme } from '@/hooks';
import TVFocusWrapper from './TVFocusWrapper';

export type SelectOption = {
  name: string;
  value: string;
};

interface TVSelectProps {
  options: SelectOption[];
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  hasTVPreferredFocus?: boolean;
  id?: number; // Optional numeric ID for focus chain
  nextFocusDown?: number;
  nextFocusUp?: number;
  nextFocusLeft?: number;
  nextFocusRight?: number;
}

const OptionItem = styled(XStack, {
  padding: '$3',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottomWidth: 1,
  borderBottomColor: '$color2',
});

const TVSelect: React.FC<TVSelectProps> = ({
  options,
  label,
  value,
  onValueChange,
  hasTVPreferredFocus = false,
  id,
  nextFocusDown,
  nextFocusUp,
  nextFocusLeft,
  nextFocusRight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(options.findIndex((opt) => opt.value === value) || 0);
  const currentTheme = useCurrentTheme();

  // Handle back button press to close the modal
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isOpen) {
        setIsOpen(false);
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [isOpen]);

  // Update selectedIndex when value changes externally
  useEffect(() => {
    const index = options.findIndex((opt) => opt.value === value);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [value, options]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (newValue: string, index: number) => {
    onValueChange(newValue);
    setSelectedIndex(index);
    setIsOpen(false);
  };

  return (
    <View>
      {/* Trigger Button */}
      <TVFocusWrapper
        isFocusable={true}
        hasTVPreferredFocus={hasTVPreferredFocus}
        onPress={toggleDropdown}
        borderColor={currentTheme?.color4}
        borderWidth={2}
        nextFocusDown={nextFocusDown}
        nextFocusUp={nextFocusUp}
        nextFocusLeft={nextFocusLeft}
        nextFocusRight={nextFocusRight}
        style={{ borderRadius: 8 }}>
        <Pressable onPress={toggleDropdown}>
          <XStack
            backgroundColor="$color3"
            padding="$3"
            borderRadius={8}
            alignItems="center"
            justifyContent="space-between"
            width={150}>
            <Text fontSize="$3" fontWeight="500" color="$color" numberOfLines={1}>
              {selectedOption?.name || label}
            </Text>
            {isOpen ? <ChevronUp size={16} color="$color" /> : <ChevronDown size={16} color="$color" />}
          </XStack>
        </Pressable>
      </TVFocusWrapper>

      {/* Modal with Options */}
      <Modal
        statusBarTranslucent
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <YStack backgroundColor="$color3" borderRadius={8} width="80%" maxHeight="70%" overflow="hidden">
            {/* Header */}
            <XStack padding="$3" backgroundColor="$color4" justifyContent="center" alignItems="center">
              <Text fontSize="$4" fontWeight="600" color="$color">
                {label}
              </Text>
            </XStack>

            {/* Options List */}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item, index }) => (
                <TVFocusWrapper
                  isFocusable={true}
                  hasTVPreferredFocus={index === selectedIndex}
                  onPress={() => handleSelect(item.value, index)}
                  borderColor={currentTheme?.color4}
                  borderWidth={2}
                  style={{ margin: 1 }}>
                  <OptionItem backgroundColor={item.value === value ? '$color4Transparent' : 'transparent'}>
                    <Text fontSize="$3" fontWeight={item.value === value ? '700' : '400'} color="$color">
                      {item.name}
                    </Text>
                  </OptionItem>
                </TVFocusWrapper>
              )}
            />
          </YStack>
        </View>
      </Modal>
    </View>
  );
};

export default TVSelect;
