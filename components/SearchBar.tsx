import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { colors, fontSizes, fontWeights } from 'lib/theme';
import { useLanguageStore } from 'stores/languageStore';
import { useApiWithStore } from 'hooks/useApiWithStore';
import { LexemeSearchResult } from 'types/api';
import { showToast } from 'lib/toast';

interface SearchBarProps {
  disabled?: boolean;
  onSearch?: (query: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export const SearchBar = ({ 
  disabled = false, 
  onSearch, 
  value = '', 
  onChange 
}: SearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState(value);
  const inputRef = useRef<TextInput>(null);
  const suggestionsRef = useRef<ScrollView>(null);
  
  const { setShowSelectLanguageModal } = useLanguageStore();
  
  // Get data from stores
  const { 
    searchLexemes, 
    selectedSourceLanguage, 
    lexemes, 
    lexemeLoading,
    setClickedLexeme
  } = useApiWithStore();

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim() && selectedSourceLanguage) {
            searchLexemes({
              ismatch: 0,
              search: query,
              src_lang: selectedSourceLanguage.lang_code
            }).catch(() => {
              // Error handling is done in the hook
            });
          }
        }, 300); // 300ms delay
      };
    })(),
    [searchLexemes, selectedSourceLanguage]
  );

  // Trigger search when value changes
  useEffect(() => {
    if (value.trim() === "") {
      setShowSuggestions(false);
      return;
    }
    
    debouncedSearch(value);
    setShowSuggestions(true);
  }, [value, debouncedSearch]);

  // Update searchQuery when value prop changes
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  const handleInputChange = async (text: string) => {
    setSearchQuery(text);
    onChange?.(text);
    
    if (text.trim() === "") {
      setShowSuggestions(false);
      return;
    }

    try {
      await searchLexemes({
        ismatch: 0,
        search: text,
        src_lang: selectedSourceLanguage?.lang_code || "",
      });
    } catch (error) {
      console.error("Search failed:", error);
    }

    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (disabled) {
      showToast.error("Languages required", "You must select source and target language first.");
      inputRef.current?.blur();
      return;
    }
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion: LexemeSearchResult) => {
    onChange?.(suggestion.label);
    setSearchQuery(suggestion.label);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setClickedLexeme(suggestion); // Save the clicked lexeme to the store
    onSearch?.(suggestion.label);
    Keyboard.dismiss();
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    onSearch?.(searchQuery);
    Keyboard.dismiss();
  };

  const clearInput = () => {
    onChange?.("");
    setSearchQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: any) => {
    if (disabled || !showSuggestions || lexemes.length === 0) return;

    // Note: React Native doesn't have the same keyboard event handling as web
    // This is a simplified version - you might want to use a library like react-native-keyboard-aware-scroll-view
    // or implement custom keyboard handling based on your needs
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              disabled && styles.inputDisabled
            ]}
            value={searchQuery}
            onChangeText={handleInputChange}
            onFocus={handleInputFocus}
            onKeyPress={handleKeyPress}
            placeholder="Type your word here"
            placeholderTextColor={colors.tertiary}
            editable={!disabled}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchQuery && !disabled && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearInput}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => setShowSelectLanguageModal(true)}>
          <Image
            source={require('assets/control.png')}
            style={styles.buttonImage}
            tintColor={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Suggestions Dropdown */}
      {!disabled && showSuggestions && lexemes.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            ref={suggestionsRef}
            style={styles.suggestionsScroll}
            keyboardShouldPersistTaps="handled"
          >
            {lexemeLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            )}
            {!lexemeLoading && lexemes.map((lexeme, index) => (
              <TouchableOpacity
                key={lexeme.id}
                style={[
                  styles.suggestionItem,
                  index === selectedIndex && styles.suggestionItemSelected
                ]}
                onPress={() => handleSuggestionSelect(lexeme)}
              >
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionLabel}>{lexeme.label}</Text>
                  <Text style={styles.suggestionDescription}>
                    {lexeme.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 5,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.lg,
    color: colors.dark,
  },
  inputDisabled: {
    backgroundColor: colors.lightGray,
    color: colors.tertiary,
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearButtonText: {
    fontSize: fontSizes.md,
    color: colors.tertiary,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  buttonImage: {
    width: 40,
    height: 40,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    maxHeight: 300,
    zIndex: 1000,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.tertiary,
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  suggestionsScroll: {
    maxHeight: 300,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: fontSizes.sm,
    color: colors.tertiary,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  suggestionItemSelected: {
    backgroundColor: colors.lightGray,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionLabel: {
    fontSize: fontSizes.md,
    color: colors.dark,
    fontWeight: fontWeights.medium as any,
    flex: 1,
  },
  suggestionDescription: {
    fontSize: fontSizes.sm,
    color: colors.tertiary,
    marginTop: 2,
  },
});
