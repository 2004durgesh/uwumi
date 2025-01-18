import { useSearchStore, useTabsStore } from '@/hooks/stores';
import { X } from '@tamagui/lucide-icons';
import React, { useCallback } from 'react';
import { TextInput } from 'react-native';
import { View, XStack } from 'tamagui';

const SearchBar: React.FC = () => {
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  const setDebouncedQuery = useSearchStore((state) => state.setDebouncedQuery);
  const setCurrentTab = useTabsStore((state) => state.setCurrentTab);

  const handleTextChange = useCallback((text: string) => {
    setSearchQuery(text);
    setDebouncedQuery(text);
  }, []);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  // Handle manual search submission
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setSearchQuery(searchQuery.trim());
      setDebouncedQuery(searchQuery.trim()); // Pass true to skip debounce
    }
    setCurrentTab('tab3');
  }, [searchQuery]);

  return (
    <View width="100%">
      <XStack
        borderWidth={1}
        borderColor="$color2"
        borderRadius={10}
        padding="$2"
        marginHorizontal="$4"
        alignItems="center">
        <TextInput
          onChangeText={handleTextChange}
          value={searchQuery}
          keyboardType="web-search"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          placeholderTextColor={'white'}
          placeholder="Search..."
          style={{
            color: 'white',
            padding: 10,
            flex: 1,
          }}
        />
        {searchQuery && <X onPress={handleClear} color="$color" />}
      </XStack>
    </View>
  );
};

export default SearchBar;
