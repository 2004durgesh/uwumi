import { useCurrentTheme, useSearchStore, useTabsStore } from '@/hooks';
import { X } from '@tamagui/lucide-icons';
import React, { useCallback, useRef } from 'react';
import { TextInput } from 'react-native';
import { Button, View, XStack } from 'tamagui';
import TVFocusWrapper, { isTV } from './TVFocusWrapper';

const SearchBar: React.FC = () => {
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  const setDebouncedQuery = useSearchStore((state) => state.setDebouncedQuery);
  const setCurrentTab = useTabsStore((state) => state.setCurrentTab);
  const currentTheme = useCurrentTheme();
  const inputRef = useRef<TextInput>(null);

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

  const handleTVInputFocus = useCallback(() => {
    if (isTV && inputRef.current) {
      inputRef.current.focus();
      console.log('Focused input');
    }
  }, []);

  return (
    <View width="100%">
      <XStack
        borderWidth={2}
        borderColor="$color2"
        borderRadius={10}
        padding="$2"
        marginTop="$4"
        marginHorizontal="$4"
        alignItems="center">
        <TVFocusWrapper
          isFocusable={true}
          hasTVPreferredFocus={isTV}
          onPress={handleTVInputFocus}
          onFocus={handleTVInputFocus}
          style={{ flex: 1, height: 50 }}>
          <TextInput
            ref={inputRef}
            onChangeText={handleTextChange}
            value={searchQuery}
            keyboardType="web-search"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            placeholderTextColor={currentTheme?.color1}
            placeholder="Search..."
            style={{
              color: currentTheme?.color1,
              padding: 10,
              flex: 1,
              fontWeight: 700,
              // height:50
            }}
            focusable
          />
        </TVFocusWrapper>
        {searchQuery && (
          <TVFocusWrapper isFocusable={true} onPress={handleClear}>
            <Button icon={X} circular onPress={handleClear} />
          </TVFocusWrapper>
        )}
      </XStack>
    </View>
  );
};

export default SearchBar;
