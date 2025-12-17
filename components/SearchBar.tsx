/**
 * @fileoverview A complex search bar component for the application, featuring real-time
 * search suggestions fetched from the API (debounced) and integration with the global store
 * for displaying results and managing selected languages.
 */

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

/**
 * @interface SearchBarProps
 * @description Props for the SearchBar component.
 * @property {boolean} [disabled=false] If true, disables input and suggestions, and prompts user to select languages.
 * @property {function(string): void} [onSearch] Callback fired when a search is explicitly triggered (e.g., enter/submit).
 * @property {string} [value=''] The current value of the search input (controlled externally).
 * @property {function(string): void} [onChange] Callback fired when the input text changes.
 */
interface SearchBarProps {
  disabled?: boolean;
  onSearch?: (query: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * @function SearchBar
 * @description Component that provides search functionality with API-driven, debounced suggestions
 * and a button to open the language selection modal.
 *
 * @param {SearchBarProps} props The props object.
 * @returns {JSX.Element} The rendered search bar and suggestions dropdown.
 */
export const SearchBar = ({ disabled = false, onSearch, value = '', onChange }: SearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState(value);
  const inputRef = useRef<TextInput>(null);
  const suggestionsRef = useRef<ScrollView>(null);

  // Action to show the language selection modal
  const { setShowSelectLanguageModal } = useLanguageStore();

  // Data and actions from the combined store/API hook
  const { searchLexemes, selectedSourceLanguage, lexemes, lexemeLoading, setClickedLexeme } =
    useApiWithStore();

  /**
   * @description Memoized and debounced function to call the search API.
   * It waits for a 300ms pause in typing before executing the search.
   * @type {function(string): void}
   */
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

  /**
   * @description Effect to trigger the debounced search whenever the external `value` prop changes.
   */
  useEffect(() => {
    if (value.trim() === '') {
      setShowSuggestions(false);
      return;
    }
    
    debouncedSearch(value);
    setShowSuggestions(true);
  }, [value, debouncedSearch]);

  /**
   * @description Effect to synchronize internal `searchQuery` state with external `value` prop.
   */
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  /**
   * @description Handles text input changes, updating internal state and external prop, and triggering search.
   * @param {string} text The new text value of the input.
   * @returns {void}
   */
  const handleInputChange = async (text: string) => {
    setSearchQuery(text);
    onChange?.(text);
    
    if (text.trim() === "") {
      setShowSuggestions(false);
      return;
    }

    // Immediately trigger search on change
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

  /**
   * @description Handles input focus event. Prevents interaction if disabled, otherwise shows suggestions.
   * @returns {void}
   * @sideeffect Shows error toast if disabled, or updates `showSuggestions` state.
   */
  const handleInputFocus = () => {
    if (disabled) {
      showToast.error("Languages required", "You must select source and target language first.");
      inputRef.current?.blur();
      return;
    }
    setShowSuggestions(true);
  };

  /**
   * @description Handles selection of a suggestion from the dropdown.
   * @param {LexemeSearchResult} suggestion The selected lexeme result object.
   * @returns {void}
   * @sideeffect Updates input text, hides suggestions, saves clicked lexeme to store, and dismisses keyboard.
   */
  const handleSuggestionSelect = (suggestion: LexemeSearchResult) => {
    onChange?.(suggestion.label);
    setSearchQuery(suggestion.label);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setClickedLexeme(suggestion); // Save the clicked lexeme to the store
    onSearch?.(suggestion.label);
    Keyboard.dismiss();
  };

  /**
   * @description Handles explicit search submission (e.g., pressing the search key on the keyboard).
   * @returns {void}
   */
  const handleSearch = () => {
    setShowSuggestions(false);
    onSearch?.(searchQuery);
    Keyboard.dismiss();
  };

  /**
   * @description Clears the input field.
   * @returns {void}
   */
  const clearInput = () => {
    onChange?.("");
    setSearchQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  /**
   * @description Placeholder for keyboard navigation handling (e.g., arrow keys).
   * Note: Custom implementation for RN keyboard events is usually required.
   * @param {any} e The keyboard event object.
   * @returns {void}
   */
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
