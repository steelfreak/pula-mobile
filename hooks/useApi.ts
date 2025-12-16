import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import { showToast } from '../lib/toast';
import {
  Language,
  LexemeSearchRequest,
  LexemeSearchResult,
  LexemeDetailRequest,
  LexemeDetailResult,
  ApiError,
} from '../types/api';

/**
 * @fileoverview Custom hook for handling asynchronous API requests, state management (loading, error, data),
 * and displaying toast notifications upon failure.
 */

/**
 * @interface ApiState
 * @description Defines the standardized structure for the state of any single API request.
 * @template T The type of the data expected from the successful API call.
 * @property {T | null} data The successful response data, or null.
 * @property {boolean} loading True if the API request is currently in flight.
 * @property {ApiError | null} error The standardized error object if the request failed, or null.
 */
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * @function useApi
 * @description A custom hook that provides state-aware functions for common API operations.
 * It manages the loading, error, and data states for language, search, and detail operations
 * and automatically shows toast notifications on errors.
 *
 * @returns {object} An object containing state variables and memoized callback functions:
 * @returns {Language[] | null} return.languages The list of available languages.
 * @returns {boolean} return.languagesLoading True if languages are being fetched.
 * @returns {ApiError | null} return.languagesError Error object if language fetching failed.
 * @returns {function(): Promise<Language[]>} return.getLanguages Function to fetch languages.
 * @returns {LexemeSearchResult[] | null} return.searchResults The results of the last lexeme search.
 * @returns {boolean} return.searchLoading True if a search is in progress.
 * @returns {ApiError | null} return.searchError Error object if search failed.
 * @returns {function(LexemeSearchRequest): Promise<LexemeSearchResult[]>} return.searchLexemes Function to search lexemes.
 * @returns {LexemeDetailResult[] | null} return.lexemeDetails The details of the last fetched lexeme.
 * @returns {boolean} return.detailsLoading True if lexeme details are being fetched.
 * @returns {ApiError | null} return.detailsError Error object if fetching details failed.
 * @returns {function(LexemeDetailRequest): Promise<LexemeDetailResult>} return.getLexemeDetails Function to fetch lexeme details.
 */
export const useApi = () => {
  const [languagesState, setLanguagesState] = useState<ApiState<Language[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const [searchState, setSearchState] = useState<ApiState<LexemeSearchResult[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const [detailsState, setDetailsState] = useState<ApiState<LexemeDetailResult[]>>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * @description Fetches the list of all available languages from the API.
   * Updates `languagesState` with loading, data, or error information.
   * @returns {Promise<Language[]>} A promise that resolves to the array of languages on success.
   * @throws {ApiError} Throws the standardized ApiError object on failure.
   * @sideeffect Shows an error toast if the request fails.
   */
  const getLanguages = useCallback(async () => {
    setLanguagesState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.getLanguages();
      setLanguagesState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setLanguagesState({ data: null, loading: false, error: apiError });

      // Show toast notification for error
      showToast.error('Error loading languages', apiError.message);

      throw apiError;
    }
  }, []);

  /**
   * @description Searches for lexemes based on a request criteria (e.g., text, language).
   * Updates `searchState` with loading, data, or error information.
   * @param {LexemeSearchRequest} request The criteria used for the lexeme search.
   * @returns {Promise<LexemeSearchResult[]>} A promise that resolves to the array of search results on success.
   * @throws {ApiError} Throws the standardized ApiError object on failure.
   * @sideeffect Shows an error toast if the request fails.
   */
  const searchLexemes = useCallback(async (request: LexemeSearchRequest) => {
    setSearchState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.searchLexemes(request);
      setSearchState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setSearchState({ data: null, loading: false, error: apiError });

      // Show toast notification for error
      showToast.error('Error searching lexemes', apiError.message);

      throw apiError;
    }
  }, []);

  /**
   * @description Fetches the detailed information for a specific lexeme.
   * Updates `detailsState` with loading, data, or error information.
   * @param {LexemeDetailRequest} request The request containing the ID of the lexeme.
   * @returns {Promise<LexemeDetailResult>} A promise that resolves to the detailed lexeme information on success.
   * @throws {ApiError} Throws the standardized ApiError object on failure.
   * @sideeffect Shows an error toast if the request fails.
   */
  const getLexemeDetails = useCallback(async (request: LexemeDetailRequest) => {
    setDetailsState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.getLexemeDetails(request);
      setDetailsState({ data: [data], loading: false, error: null });
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      setDetailsState({ data: null, loading: false, error: apiError });

      // Show toast notification for error
      showToast.error('Error loading lexeme details', apiError.message);
      throw apiError;
    }
  }, []);

  return {
    // Languages
    languages: languagesState.data,
    languagesLoading: languagesState.loading,
    languagesError: languagesState.error,
    getLanguages,

    // Search
    searchResults: searchState.data,
    searchLoading: searchState.loading,
    searchError: searchState.error,
    searchLexemes,

    // Details
    lexemeDetails: detailsState.data,
    detailsLoading: detailsState.loading,
    detailsError: detailsState.error,
    getLexemeDetails,
  };
};
