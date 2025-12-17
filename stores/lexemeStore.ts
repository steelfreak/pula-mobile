/**
 * @fileoverview Zustand store for managing lexeme (word/concept) data state,
 * including search results, the current query, and the details of selected lexemes.
 * Data is persisted to AsyncStorage.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LexemeSearchResult, LexemeDetailResult } from '../types/api';
import { CLICKED_LEXEME, LIST_OF_LEXEMES, SELECTED_LEXEME } from '../lib/constants';

/**
 * @interface LexemeState
 * @description Defines the shape of the lexeme state and the actions available in the store.
 * @property {LexemeSearchResult[]} lexemes The list of lexemes returned from the last search operation.
 * @property {string} query The text of the last search query performed.
 * @property {LexemeDetailResult | null} selectedLexeme The detailed result object of the currently viewed lexeme (full translations, etc.).
 * @property {LexemeSearchResult | null} clickedLexeme The simpler lexeme object representing the item the user clicked to view details.
 * @property {boolean} loading True if a lexeme-related operation (search, detail fetch) is currently in progress.
 * @property {string | null} error Stores an error message if a lexeme operation failed.
 *
 * @property {function(LexemeSearchResult[]): void} setLexemes Sets the search result list in the store.
 * @property {function(string): void} setQuery Sets the current search query string.
 * @property {function(LexemeDetailResult | null): void} setSelectedLexeme Sets the detailed lexeme result in the store.
 * @property {function(LexemeSearchResult | null): Promise<void>} setClickedLexeme Sets the clicked lexeme and persists it to AsyncStorage.
 * @property {function(boolean): void} setLoading Sets the loading status for lexeme operations.
 * @property {function(string | null): void} setError Sets the error message for lexeme operations.
 * @property {function(): void} reset Resets all primary lexeme and state properties to their initial values.
 * @property {function(): Promise<void>} hydrate Loads persisted lexeme data from AsyncStorage into the store.
 */
export interface LexemeState {
  lexemes: LexemeSearchResult[];
  query: string;
  selectedLexeme: LexemeDetailResult | null;
  clickedLexeme: LexemeSearchResult | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLexemes: (lexemes: LexemeSearchResult[]) => void;
  setQuery: (query: string) => void;
  setSelectedLexeme: (lexeme: LexemeDetailResult | null) => void;
  setClickedLexeme: (lexeme: LexemeSearchResult | null) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  hydrate: () => Promise<void>;
}

/**
 * @function useLexemeStore
 * @description Zustand hook/store for managing lexeme search and detail state.
 * @returns {LexemeState} The current lexeme state and available actions.
 */
export const useLexemeStore = create<LexemeState>((set: any) => ({
  lexemes: [],
  query: '',
  selectedLexeme: null,
  clickedLexeme: null,
  loading: false,
  error: null,

  /**
   * @description Sets the list of lexeme search results.
   * @param {LexemeSearchResult[]} lexemes The array of lexeme search result objects.
   * @returns {void}
   * @sideeffect Updates store state (`lexemes`).
   */
  setLexemes: (lexemes: any) => set({ lexemes }),

  /**
   * @description Sets the current search query string.
   * @param {string} query The search string.
   * @returns {void}
   * @sideeffect Updates store state (`query`).
   */
  setQuery: (query: string) => set({ query }),

  /**
   * @description Sets the detailed information for the currently viewed lexeme.
   * @param {LexemeDetailResult | null} lexeme The detailed lexeme object, or null to clear.
   * @returns {void}
   * @sideeffect Updates store state (`selectedLexeme`).
   */
  setSelectedLexeme: (lexeme: any) => set({ selectedLexeme: lexeme }),

  /**
   * @description Sets the simplified lexeme object that was clicked by the user, and persists it.
   * Note: The constant `SELECTED_LEXEME` is used here for storing `clickedLexeme`, which might be a naming convention choice.
   * @param {LexemeSearchResult | null} lexeme The lexeme search result object.
   * @returns {Promise<void>}
   * @sideeffect Updates store state (`clickedLexeme`) and writes to AsyncStorage under `SELECTED_LEXEME`.
   */
  setClickedLexeme: async (lexeme: any) => {
    set({ clickedLexeme: lexeme });
    await AsyncStorage.setItem(SELECTED_LEXEME, JSON.stringify(lexeme));
  },

  /**
   * @description Sets the loading status for lexeme operations.
   * @param {boolean} loading The new loading state.
   * @returns {void}
   * @sideeffect Updates store state (`loading`).
   */
  setLoading: (loading: boolean) => set({ loading }),

  /**
   * @description Sets an error message for failed lexeme operations.
   * @param {string | null} error The error string, or null to clear.
   * @returns {void}
   * @sideeffect Updates store state (`error`).
   */
  setError: (error: any) => set({ error }),

  /**
   * @description Resets all primary lexeme and state variables to their initial values.
   * @returns {void}
   * @sideeffect Updates store state for all listed properties.
   */
  reset: () =>
    set({
      lexemes: [],
      query: '',
      selectedLexeme: null,
      clickedLexeme: null,
      loading: false,
      error: null,
    }),

  /**
   * @description Hydrates the store by loading persisted lexeme data (list, selected, clicked) from AsyncStorage.
   * This should be called once on application startup.
   * @returns {Promise<void>}
   * @sideeffect Reads from AsyncStorage and updates store state for `lexemes`, `selectedLexeme`, and `clickedLexeme` if values are found.
   */
  hydrate: async () => {
    const storedLexemes = await AsyncStorage.getItem(LIST_OF_LEXEMES);
    const storedSelected = await AsyncStorage.getItem(SELECTED_LEXEME);
    const storedClicked = await AsyncStorage.getItem(CLICKED_LEXEME);

    if (storedLexemes) {
      set({ lexemes: JSON.parse(storedLexemes) });
    }
    if (storedSelected) {
      // NOTE: This assumes that SELECTED_LEXEME storage key holds LexemeDetailResult,
      // but is used by setClickedLexeme to store LexemeSearchResult.
      // Assuming this is the storage key used to persist selected/clicked data.
      set({ selectedLexeme: JSON.parse(storedSelected) });
    }
    if (storedClicked) {
      set({ clickedLexeme: JSON.parse(storedClicked) });
    }
  },
}));
