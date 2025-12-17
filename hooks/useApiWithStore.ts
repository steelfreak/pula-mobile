import { useCallback, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from "lib/api";
import { useLanguageStore, useLexemeStore } from "../stores";
import { showToast } from '../lib/toast';
import { useAuthStore } from "../stores/authStore";
import {
  LexemeSearchRequest,
  LexemeDetailRequest,
  ApiError,
  AddLabeledTranslationRequest,
  AddAudioTranslationRequest,
  LexemeMissingAudioResquest,
} from "../types/api";
// Import store state types
import type { LanguageState } from "../stores/languageStore";
import type { LexemeState } from "../stores/lexemeStore";
import type { AuthState } from "../stores/authStore";
import {
  LIST_OF_LANGUAGES,
  LIST_OF_LEXEMES,
  SELECTED_LEXEME,
} from "../lib/constants";

/**
 * @fileoverview Custom hook that integrates API calls with global state management (Zustand stores)
 * and local persistence (AsyncStorage). It handles loading/error states, authentication token management,
 * and data hydration on mount.
 */

/**
 * @function useApiWithStore
 * @description Provides a comprehensive interface for performing API operations and
 * automatically updating the corresponding global stores (Auth, Language, Lexeme).
 *
 * @returns {object} An object containing memoized action functions and selected state variables from the stores.
 *
 * @returns {function(AddLabeledTranslationRequest[]): Promise<void>} return.addLabeledTranslation Function to add a labeled translation.
 * @returns {function(AddAudioTranslationRequest[]): Promise<void>} return.addAudioTranslation Function to add an audio translation.
 * @returns {function(): Promise<Language[]>} return.getLanguages Function to fetch and store languages.
 * @returns {function(string | null): void} return.setSelectedSourceLanguage Setter for the source language in the store.
 * @returns {function(string | null): void} return.setSelectedTargetLanguage1 Setter for the first target language in the store.
 * @returns {function(string | null): void} return.setSelectedTargetLanguage2 Setter for the second target language in the store.
 * @returns {function(LexemeSearchRequest): Promise<LexemeSearchResult[] | undefined>} return.searchLexemes Function to search and store lexemes.
 * @returns {function(): Promise<LexemeDetailResult | undefined>} return.getLexemeDetails Function to fetch and store lexeme details.
 * @returns {function(string): void} return.setQuery Setter for the current search query in the store.
 * @returns {function(object | null): void} return.setClickedLexeme Setter for the lexeme clicked for detail viewing.
 * @returns {function(LexemeMissingAudioResquest): Promise<LexemeMissingAudioResponse>} return.getLexemeMissingAudio Function to fetch lexemes missing audio.
 * @returns {function(): Promise<LoginResponse>} return.login Function to start the OAuth login process.
 * @returns {function(string, string): Promise<OauthCallbackResponse>} return.oauthCallback Function to finalize OAuth and set the token.
 * @returns {function(): Promise<void>} return.logout Function to clear session and token.
 *
 * @returns {Language[] | null} return.languages List of all available languages.
 * @returns {object | null} return.selectedSourceLanguage The currently selected source language object.
 * (Other state variables are also returned for immediate access.)
 */
export const useApiWithStore = () => {
  const token = useAuthStore((state: AuthState) => state.token);
  const hydrateAuth = useAuthStore((state: AuthState) => state.hydrate);
  const hydrateLanguage = useLanguageStore((state: LanguageState) => state.hydrate);
  const hydrateLexeme = useLexemeStore((state: LexemeState) => state.hydrate);

  /**
   * @description Effect hook to hydrate all global stores from AsyncStorage upon component mount.
   * @sideeffect Reads persistent state from AsyncStorage and sets initial store state.
   */
  useEffect(() => {
    const hydrateStores = async () => {
      await hydrateAuth();
      await hydrateLanguage();
      await hydrateLexeme();
    };
    hydrateStores();
  }, [hydrateAuth, hydrateLanguage, hydrateLexeme]);

  // Use individual selectors to avoid object recreation
  const setLanguages = useLanguageStore(
    (state: LanguageState) => state.setLanguages
  );
  const setSelectedSourceLanguage = useLanguageStore(
    (state: LanguageState) => state.setSelectedSourceLanguage
  );
  const setSelectedTargetLanguage1 = useLanguageStore(
    (state: LanguageState) => state.setSelectedTargetLanguage1
  );
  const setSelectedTargetLanguage2 = useLanguageStore(
    (state: LanguageState) => state.setSelectedTargetLanguage2
  );
  const setLanguageLoading = useLanguageStore(
    (state: LanguageState) => state.setLoading
  );
  const setLanguageError = useLanguageStore(
    (state: LanguageState) => state.setError
  );

  const setLexemes = useLexemeStore((state: LexemeState) => state.setLexemes);
  const setQuery = useLexemeStore((state: LexemeState) => state.setQuery);
  const setSelectedLexeme = useLexemeStore(
    (state: LexemeState) => state.setSelectedLexeme
  );
  const setClickedLexeme = useLexemeStore(
    (state: LexemeState) => state.setClickedLexeme
  );
  const setLexemeLoading = useLexemeStore(
    (state: LexemeState) => state.setLoading
  );
  const setLexemeError = useLexemeStore((state: LexemeState) => state.setError);

  /**
   * @description Fetches the list of languages from the API.
   * @returns {Promise<Language[]>} A promise that resolves to the fetched list of Language objects.
   * @throws {ApiError} Throws a standardized error if the API call fails.
   * @sideeffect Sets the authentication token in the API client, updates `languageLoading` and `languageError` states,
   * stores data in `LanguageStore`, and persists the list to `AsyncStorage` under `LIST_OF_LANGUAGES`.
   */
  const getLanguages = useCallback(async () => {
    api.setAuthToken(token);
    setLanguageLoading(true);
    setLanguageError(null);

    try {
      const languages = await api.getLanguages();
      setLanguages(languages);
      await AsyncStorage.setItem(LIST_OF_LANGUAGES, JSON.stringify(languages));
      return languages;
    } catch (error) {
      const apiError = error as ApiError;
      setLanguageError(apiError.message);

      // Show toast notification for error
      showToast.error("Error loading languages", apiError.message);

      throw apiError;
    } finally {
      setLanguageLoading(false);
    }
  }, [setLanguages, setLanguageLoading, setLanguageError, token]);

  /**
   * @description Searches for lexemes based on a query and stores the results.
   * @param {LexemeSearchRequest} request The search criteria including search text and source language.
   * @returns {Promise<LexemeSearchResult[] | undefined>} A promise that resolves to the array of search results, or undefined if request is incomplete.
   * @throws {ApiError} Throws a standardized error if the API call fails.
   * @sideeffect Updates `lexemeLoading` and `lexemeError` states, sets the search query and results in `LexemeStore`,
   * and persists the results to `AsyncStorage` under `LIST_OF_LEXEMES`.
   */
  const searchLexemes = useCallback(
    async (request: LexemeSearchRequest) => {
      setLexemeLoading(true);
      setLexemeError(null);
      setQuery(request.search);

      if (!request.search || !request.src_lang) {
        return;
      }

      try {
        const lexemes = await api.searchLexemes(request);
        setLexemes(lexemes);
        await AsyncStorage.setItem(LIST_OF_LEXEMES, JSON.stringify(lexemes));
        return lexemes;
      } catch (error) {
        const apiError = error as ApiError;
        setLexemeError(apiError.message);

        // Show toast notification for error
        showToast.error("Error searching lexemes", apiError.message);

        throw apiError;
      } finally {
        setLexemeLoading(false);
      }
    },
    [setLexemes, setQuery, setLexemeLoading, setLexemeError]
  );

  /**
   * @description Fetches detailed information for the currently selected/clicked lexeme,
   * using language settings from the LanguageStore.
   * @returns {Promise<LexemeDetailResult | undefined>} A promise that resolves to the detailed lexeme result, or undefined if parameters are missing.
   * @throws {ApiError} Throws a standardized error if the API call fails.
   * @sideeffect Reads necessary parameters directly from the global stores, updates `lexemeLoading` and `lexemeError` states,
   * sets the result in `LexemeStore`, and persists the result to `AsyncStorage` under `SELECTED_LEXEME`.
   */
  const getLexemeDetails = useCallback(async () => {
    setLexemeLoading(true);
    setLexemeError(null);

    // Get required parameters from stores
    const clickedLexeme = useLexemeStore.getState().clickedLexeme;
    const selectedSourceLanguage =
      useLanguageStore.getState().selectedSourceLanguage;
    const selectedTargetLanguage1 =
      useLanguageStore.getState().selectedTargetLanguage1;
    const selectedTargetLanguage2 =
      useLanguageStore.getState().selectedTargetLanguage2;

    if (!clickedLexeme || !selectedSourceLanguage || !selectedTargetLanguage1 || !selectedTargetLanguage2) {
      return;
    }

    let request: LexemeDetailRequest = {
      id: clickedLexeme?.id || "",
      src_lang: selectedSourceLanguage?.lang_code || "",
      lang_1: selectedTargetLanguage1?.lang_code || "",
      lang_2: selectedTargetLanguage2?.lang_code || "",
    };

    try {
      const details = await api.getLexemeDetails(request);
      await AsyncStorage.setItem(SELECTED_LEXEME, JSON.stringify(details));
      setSelectedLexeme(details);
      return details;
    } catch (error) {
      const apiError = error as ApiError;
      setLexemeError(apiError.message);
      setSelectedLexeme(null);
      await AsyncStorage.removeItem(SELECTED_LEXEME);

      // Show toast notification for error
      showToast.error("Error loading lexeme details", apiError.message);

      throw apiError;
    } finally {
      setLexemeLoading(false);
    }
  }, [setSelectedLexeme, setLexemeLoading, setLexemeError]);

  /**
   * @description Submits a new labeled translation to the API for a lexeme.
   * @param {AddLabeledTranslationRequest[]} request The array of translation data to be added.
   * @returns {Promise<void>} A promise that resolves upon successful submission.
   * @throws {ApiError} Throws a standardized error if the API call fails.
   * @sideeffect Sets the authentication token, updates `lexemeLoading` and `lexemeError` states.
   */
  const addLabeledTranslation = useCallback(
    async (request: AddLabeledTranslationRequest[]) => {
      api.setAuthToken(token);
      setLexemeLoading(true);
      setLexemeError(null);

      try {
        const response = await api.addLabeledTranslation(request);
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        setLexemeError(apiError.message);
        throw apiError;
      } finally {
        setLexemeLoading(false);
      }
    },
    [setLexemeError, setLexemeLoading, token]
  );

  /**
   * @description Submits a new audio translation to the API for a lexeme.
   * @param {AddAudioTranslationRequest[]} request The array of audio translation data to be added.
   * @returns {Promise<void>} A promise that resolves upon successful submission.
   * @throws {ApiError} Throws a standardized error if the API call fails.
   * @sideeffect Sets the authentication token, updates `lexemeLoading` and `lexemeError` states.
   */
  const addAudioTranslation = useCallback(
    async (request: AddAudioTranslationRequest[]) => {
      api.setAuthToken(token);
      setLexemeLoading(true);
      setLexemeError(null);

      try {
        const response = await api.addAudioTranslation(request);
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        setLexemeError(apiError.message);
        throw apiError;
      } finally {
        setLexemeLoading(false);
      }
    },
    [setLexemeError, token]
  );

  /**
   * @description Fetches the list of lexemes that are missing audio recordings for a specific language.
   * @param {LexemeMissingAudioResquest} request The request containing the target language ID.
   * @returns {Promise<LexemeMissingAudioResponse>} A promise that resolves to the result object containing the list.
   * @throws {ApiError} Throws a standardized error if the API call fails.
   * @sideeffect Updates `lexemeLoading` and `lexemeError` states, and shows an error toast on failure.
   */
  const getLexemeMissingAudio = useCallback(
    async (request: LexemeMissingAudioResquest) => {
      setLexemeLoading(true);
      setLexemeError(null);
      try {
        const result = await api.getLexemeMissingAudio(request);
        // You may want to store this in a dedicated store if needed
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        setLexemeError(apiError.message);
        showToast.error("Error loading missing audio lexemes", apiError.message);
        throw apiError;
      } finally {
        setLexemeLoading(false);
      }
    },
    [setLexemeLoading, setLexemeError]
  );

  /**
   * @description Initiates the OAuth login process by retrieving the redirect URL from the API.
   * @returns {Promise<LoginResponse>} A promise that resolves to the login response object containing the redirect string.
   * @throws {ApiError} Throws a standardized error if the API call fails, and shows a toast.
   */
  const login = useCallback(async () => {
    try {
      return await api.login();
    } catch (error) {
      const apiError = error as ApiError;
      showToast.error("Login failed", apiError.message);
      throw apiError;
    }
  }, []);

  const setUsername = useAuthStore((state: AuthState) => state.setUsername);
  const setToken = useAuthStore((state: AuthState) => state.setToken);

  /**
   * @description Handles the final step of the OAuth flow, exchanging the verifier/token for a permanent application token.
   * @param {string} oauth_verifier The verifier string received from the OAuth provider.
   * @param {string} oauth_token The temporary token received from the OAuth provider.
   * @returns {Promise<OauthCallbackResponse>} A promise that resolves to the final auth response.
   * @throws {ApiError} Throws a standardized error if the exchange fails, and shows a toast.
   * @sideeffect Sets the received `token` and `username` in the `AuthStore` if successful.
   */
  const oauthCallback = useCallback(
    async (oauth_verifier: string, oauth_token: string) => {
      api.setAuthToken(token);
      try {
        const response = await api.oauthCallback(oauth_verifier, oauth_token);
        if (response.token) {
          setToken(response.token);
          setUsername(response.username);
        }
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        showToast.error("OAuth Callback failed", apiError.message);
        throw apiError;
      }
    },
    [token, setUsername, setToken]
  );

  /**
   * Clear the token in the store and local storage
   */
  const clearToken = useAuthStore((state: AuthState) => state.clearToken);

  /**
   * Clear the username in the store and local storage
   */
  const clearUsername = useAuthStore((state: AuthState) => state.clearUsername);

  /**
   * @description Performs the API logout call and clears the local authentication state.
   * @returns {Promise<void>} A promise that resolves upon successful logout.
   * @throws {ApiError} Throws a standardized error if the API call fails, and shows a toast.
   * @sideeffect Clears the token in the API client, calls `clearToken` and `clearUsername` actions in the `AuthStore`.
   */
  const logout = useCallback(async () => {
    api.setAuthToken(token);
    try {
      await api.logout();
      clearToken();
      clearUsername();
    } catch (error) {
      const apiError = error as ApiError;
      showToast.error("Logout failed", apiError.message);
      throw apiError;
    }
  }, [token, clearToken, clearUsername]);

  return {
    addLabeledTranslation,
    addAudioTranslation,
    // Language store actions
    getLanguages,
    setSelectedSourceLanguage,
    setSelectedTargetLanguage1,
    setSelectedTargetLanguage2,

    // Lexeme store actions
    searchLexemes,
    getLexemeDetails,
    setQuery,
    setClickedLexeme,
    getLexemeMissingAudio,

    // Auth actions
    login,
    oauthCallback,
    logout,

    // State from stores
    languages: useLanguageStore((state: LanguageState) => state.languages),
    selectedSourceLanguage: useLanguageStore(
      (state: LanguageState) => state.selectedSourceLanguage
    ),
    selectedTargetLanguage1: useLanguageStore(
      (state: LanguageState) => state.selectedTargetLanguage1
    ),
    selectedTargetLanguage2: useLanguageStore(
      (state: LanguageState) => state.selectedTargetLanguage2
    ),
    languageLoading: useLanguageStore((state: LanguageState) => state.loading),
    languageError: useLanguageStore((state: LanguageState) => state.error),

    lexemes: useLexemeStore((state: LexemeState) => state.lexemes),
    query: useLexemeStore((state: LexemeState) => state.query),
    selectedLexeme: useLexemeStore(
      (state: LexemeState) => state.selectedLexeme
    ),
    clickedLexeme: useLexemeStore((state: LexemeState) => state.clickedLexeme),
    lexemeLoading: useLexemeStore((state: LexemeState) => state.loading),
    lexemeError: useLexemeStore((state: LexemeState) => state.error),

    // Reset functions
    resetLanguageStore: useLanguageStore((state: LanguageState) => state.reset),
    resetLexemeStore: useLexemeStore((state: LexemeState) => state.reset),
  };
};
