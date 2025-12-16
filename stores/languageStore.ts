/**
 * @fileoverview Zustand store for managing the application's language state,
 * including the list of available languages and the user's current source/target selections.
 * Selected languages are persisted to AsyncStorage.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types/api';
import { SELECTED_SOURCE_LANGUAGE, SELECTED_TARGET_LANGUAGE1, SELECTED_TARGET_LANGUAGE2 } from '../lib/constants';

/**
 * @interface LanguageState
 * @description Defines the shape of the language state and the actions available in the store.
 * @property {Language[]} languages The list of all available languages fetched from the API.
 * @property {Language | null} selectedSourceLanguage The currently selected source language for translation/search.
 * @property {Language | null} selectedTargetLanguage1 The first currently selected target language for translation/display.
 * @property {Language | null} selectedTargetLanguage2 The second currently selected target language for translation/display.
 * @property {boolean} loading True if language data (e.g., fetching the list) is currently loading.
 * @property {string | null} error Stores an error message if a language-related operation failed.
 * @property {boolean} showSelectLanguageModal Controls the visibility of the language selection modal UI.
 * @property {function(boolean): void} setShowSelectLanguageModal Toggles the visibility of the language selection modal.
 *
 * @property {function(Language[]): void} setLanguages Sets the full list of available languages in the store.
 * @property {function(Language | null): Promise<void>} setSelectedSourceLanguage Sets the source language and persists it to AsyncStorage.
 * @property {function(Language | null): Promise<void>} setSelectedTargetLanguage1 Sets the first target language and persists it to AsyncStorage.
 * @property {function(Language | null): Promise<void>} setSelectedTargetLanguage2 Sets the second target language and persists it to AsyncStorage.
 * @property {function(boolean): void} setLoading Sets the loading status for language operations.
 * @property {function(string | null): void} setError Sets the error message for language operations.
 * @property {function(): void} reset Resets all primary language and state properties to their initial values.
 * @property {function(): Promise<void>} hydrate Loads persisted selected language settings from AsyncStorage into the store.
 */
export interface LanguageState {
  languages: Language[];
  selectedSourceLanguage: Language | null;
  selectedTargetLanguage1: Language | null;
  selectedTargetLanguage2: Language | null;
  loading: boolean;
  error: string | null;
  showSelectLanguageModal: boolean;
  setShowSelectLanguageModal: (show: boolean) => void;
  
  // Actions
  setLanguages: (languages: Language[]) => void;
  setSelectedSourceLanguage: (language: Language | null) => Promise<void>;
  setSelectedTargetLanguage1: (language: Language | null) => Promise<void>;
  setSelectedTargetLanguage2: (language: Language | null) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  hydrate: () => Promise<void>;
}

/**
 * @function useLanguageStore
 * @description Zustand hook/store for managing language selections and available lists.
 * @returns {LanguageState} The current language state and available actions.
 */
export const useLanguageStore = create<LanguageState>((set) => ({
  languages: [],
  selectedSourceLanguage: null,
  selectedTargetLanguage1: null,
  selectedTargetLanguage2: null,
  loading: false,
  error: null,
  showSelectLanguageModal: false,

  /**
   * @description Toggles the visibility state of the language selection modal.
   * @param {boolean} show New state for modal visibility.
   * @returns {void}
   * @sideeffect Updates store state (`showSelectLanguageModal`).
   */
  setShowSelectLanguageModal: (show) => set({ showSelectLanguageModal: show }),

  /**
   * @description Sets the complete list of available languages.
   * @param {Language[]} languages The array of language objects.
   * @returns {void}
   * @sideeffect Updates store state (`languages`).
   */
  setLanguages: (languages) => set({ languages }),

  /**
   * @description Sets the selected source language in the store and persists it to AsyncStorage.
   * @param {Language | null} language The language object to set as the source.
   * @returns {Promise<void>}
   * @sideeffect Updates store state (`selectedSourceLanguage`) and writes to AsyncStorage.
   */
  setSelectedSourceLanguage: async (language) => {
    set({ selectedSourceLanguage: language });
    await AsyncStorage.setItem(SELECTED_SOURCE_LANGUAGE, JSON.stringify(language));
  },

  /**
   * @description Sets the first selected target language in the store and persists it to AsyncStorage.
   * @param {Language | null} language The language object to set as target 1.
   * @returns {Promise<void>}
   * @sideeffect Updates store state (`selectedTargetLanguage1`) and writes to AsyncStorage.
   */
  setSelectedTargetLanguage1: async (language) => {
    set({ selectedTargetLanguage1: language });
    await AsyncStorage.setItem(SELECTED_TARGET_LANGUAGE1, JSON.stringify(language));
  },

  /**
   * @description Sets the second selected target language in the store and persists it to AsyncStorage.
   * @param {Language | null} language The language object to set as target 2.
   * @returns {Promise<void>}
   * @sideeffect Updates store state (`selectedTargetLanguage2`) and writes to AsyncStorage.
   */
  setSelectedTargetLanguage2: async (language) => {
    set({ selectedTargetLanguage2: language });
    await AsyncStorage.setItem(SELECTED_TARGET_LANGUAGE2, JSON.stringify(language));
  },

  /**
   * @description Sets the loading status for language operations.
   * @param {boolean} loading The new loading state.
   * @returns {void}
   * @sideeffect Updates store state (`loading`).
   */
  setLoading: (loading) => set({ loading }),

  /**
   * @description Sets an error message for failed language operations.
   * @param {string | null} error The error string, or null to clear.
   * @returns {void}
   * @sideeffect Updates store state (`error`).
   */
  setError: (error) => set({ error }),

  /**
   * @description Resets all primary language and state variables to their initial values (empty array/null/false).
   * Note: This does not clear AsyncStorage persistence.
   * @returns {void}
   * @sideeffect Updates store state for all listed properties.
   */
  reset: () =>
    set({
      languages: [],
      selectedSourceLanguage: null,
      selectedTargetLanguage1: null,
      selectedTargetLanguage2: null,
      loading: false,
      error: null,
    }),

  /**
   * @description Hydrates the store by loading selected language settings from AsyncStorage.
   * This should be called once on application startup.
   * @returns {Promise<void>}
   * @sideeffect Reads from AsyncStorage and updates store state for the three selected language properties if values are found.
   */
  hydrate: async () => {
    const storedSource = await AsyncStorage.getItem(SELECTED_SOURCE_LANGUAGE);
    const storedTarget1 = await AsyncStorage.getItem(SELECTED_TARGET_LANGUAGE1);
    const storedTarget2 = await AsyncStorage.getItem(SELECTED_TARGET_LANGUAGE2);

    if (storedSource) {
      set({ selectedSourceLanguage: JSON.parse(storedSource) });
    }
    if (storedTarget1) {
      set({ selectedTargetLanguage1: JSON.parse(storedTarget1) });
    }
    if (storedTarget2) {
      set({ selectedTargetLanguage2: JSON.parse(storedTarget2) });
    }
  },
}));
