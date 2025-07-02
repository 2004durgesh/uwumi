import { ThemedView } from '@/components/ThemedView';
import { ChevronDown, Languages } from '@tamagui/lucide-icons';
import { useState, useMemo, useCallback, useRef } from 'react';
import { Sheet, Input, Button, YStack, View, Text, XStack, Separator } from 'tamagui';
import { SUB_LANGUAGE } from '@/constants/subtitle-language';
import { debounce } from 'lodash';

const Example = () => {
  const [open, setOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('');
  const [inputValue, setInputValue] = useState('');


  const handleSearchChange = useCallback((text: string) => {
    setSearchLanguage(text);
  }, []);

  // Improved search function with fuzzy matching
  const filteredLanguages = useMemo(() => {
    if (!searchLanguage.trim()) {
      return Object.values(SUB_LANGUAGE);
    }

    const searchTerms = searchLanguage.toLowerCase().trim().split(/\s+/);

    return Object.values(SUB_LANGUAGE)
      .filter((lang) => {
        const langLower = lang.toLowerCase();
        const langParts = langLower.split(/[\s()]+/); // Split by spaces and parentheses

        return searchTerms.every((term) => langParts.some((part) => part.startsWith(term)));
      })
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const searchLower = searchLanguage.toLowerCase().trim(); // Prioritize exact matches

        if (aLower === searchLower) return -1;
        if (bLower === searchLower) return 1; // Prioritize matches where the beginning of the language name matches the search term

        if (aLower.startsWith(searchLower) && !bLower.startsWith(searchLower)) return -1;
        if (bLower.startsWith(searchLower) && !aLower.startsWith(searchLower)) return 1; // Fallback to alphabetical sorting

        return a.localeCompare(b);
      });
  }, [searchLanguage]);

  return (
    <ThemedView>
      <View padding="$4">
        <Button size="$4" theme="blue" icon={Languages} onPress={() => setOpen(true)}>
          Add Subtitle
        </Button>

        <Sheet modal open={open} onOpenChange={setOpen} snapPoints={[85]} dismissOnSnapToBottom>
          <Sheet.Frame
            backgroundColor="$background"
            borderTopLeftRadius="$6"
            borderTopRightRadius="$6"
            padding="$4"
            shadowOffset={{ width: 0, height: -4 }}
            shadowRadius={12}
            shadowOpacity={0.1}>
            <YStack gap="$4">
              <YStack gap="$3">
                <XStack alignItems="center" gap="$2">
                  <Input
                    flex={1}
                    placeholder="Movie/Show Name"
                    backgroundColor="$color3"
                    borderColor="$borderColor"
                    focusStyle={{
                      borderColor: '$color4',
                      backgroundColor: '$background',
                    }}
                  />
                </XStack>

                <XStack gap="$3" flexWrap="wrap">
                  <Input
                    flex={1}
                    placeholder="Season"
                    keyboardType="numeric"
                    backgroundColor="$color3"
                    borderColor="$borderColor"
                    focusStyle={{
                      borderColor: '$color4',
                      backgroundColor: '$background',
                    }}
                  />
                  <Input
                    flex={1}
                    placeholder="Episode"
                    keyboardType="numeric"
                    backgroundColor="$color3"
                    borderColor="$borderColor"
                    focusStyle={{
                      borderColor: '$color4',
                      backgroundColor: '$background',
                    }}
                  />
                  <Input
                    flex={1}
                    placeholder="Language"
                    value={selectedLanguage}
                    editable={false}
                    backgroundColor="$color3"
                    borderColor="$borderColor"
                    color="$color1"
                  />
                </XStack>

                <Button
                  size="$3"
                  variant="outlined"
                  iconAfter={ChevronDown}
                  backgroundColor="$background"
                  borderColor="$borderColor"
                  color="$color1"
                  hoverStyle={{ backgroundColor: '$color3' }}
                  onPress={() => {
                    setSelectOpen(true);
                    setSearchLanguage('');
                    setInputValue('');
                  }}>
                  Choose Language
                </Button>
              </YStack>

              <Sheet modal open={selectOpen} onOpenChange={setSelectOpen} snapPoints={[60]} dismissOnSnapToBottom>
                <Sheet.Frame
                  backgroundColor="$background"
                  borderTopLeftRadius="$4"
                  borderTopRightRadius="$4"
                  padding="$4">
                  <YStack flex={1} gap="$3">
                    <XStack alignItems="center" justifyContent="center" paddingBottom="$2">
                      <View height={3} width={32} backgroundColor="$color3" borderRadius="$2" />
                    </XStack>

                    <Text fontSize="$5" fontWeight="600" color="$color1" textAlign="center" marginBottom="$2">
                      Select Language
                    </Text>

                    <Separator />

                    <Sheet.ScrollView showsVerticalScrollIndicator={false}>
                      <YStack gap="$2">
                        <Input //making this a controlled input lags also without controlled input it works too so 👍
                          placeholder="Search languages..."
                          backgroundColor="$color3"
                          borderColor="$borderColor"
                          autoCorrect={false}
                          autoCapitalize="none"
                          autoComplete="off"
                          onChangeText={handleSearchChange}
                          onSubmitEditing={(e) => handleSearchChange(e.nativeEvent.text)}
                          focusStyle={{
                            borderColor: '$color4',
                            backgroundColor: '$background',
                          }}
                        />
                        {filteredLanguages.length > 0 ? (
                          filteredLanguages.map((lang, index) => (
                            <Button
                              key={index}
                              size="$4"
                              variant="outlined"
                              backgroundColor={selectedLanguage === lang ? '$color4' : '$background'}
                              borderColor={selectedLanguage === lang ? '$color4' : '$borderColor'}
                              color={selectedLanguage === lang ? '$background' : '$color1'}
                              hoverStyle={{ backgroundColor: '$color3' }}
                              pressStyle={{ backgroundColor: '$color4' }}
                              onPress={() => {
                                setSelectOpen(false);
                                setSelectedLanguage(lang);
                                setSearchLanguage('');
                                setInputValue('');
                              }}>
                              {lang}
                            </Button>
                          ))
                        ) : (
                          <Text color="$color2" textAlign="center" padding="$4">
                            No languages found matching "{searchLanguage}"
                          </Text>
                        )}
                      </YStack>
                    </Sheet.ScrollView>
                  </YStack>
                </Sheet.Frame>
              </Sheet>

              <Separator marginTop="$2" />

              <XStack gap="$3" paddingTop="$2">
                <Button
                  flex={1}
                  size="$4"
                  variant="outlined"
                  borderColor="$borderColor"
                  color="$color2"
                  onPress={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  flex={1}
                  size="$4"
                  theme="blue"
                  backgroundColor="$color4"
                  color="$background"
                  fontWeight="600"
                  onPress={() => {
                    // Handle submit logic here
                    setOpen(false);
                  }}>
                  Submit
                </Button>
              </XStack>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </View>
    </ThemedView>
  );
};

export default Example;
