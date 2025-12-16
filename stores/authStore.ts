/**
 * @fileoverview Zustand store for managing application-wide authentication state,
 * including the user's access token and username, with persistence to AsyncStorage.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @constant {string} TOKEN_KEY The key used for storing the authentication token in AsyncStorage.
 */
export const TOKEN_KEY = 'auth_token';

/**
 * @interface AuthState
 * @description Defines the shape of the authentication state and the actions available in the store.
 * @property {string | null} token The JWT or session token for authenticated requests, or null if logged out.
 * @property {string} username The logged-in user's display username.
 * @property {function(string): Promise<void>} setToken Sets the token in state and persists it to AsyncStorage.
 * @property {function(): Promise<void>} clearToken Clears the token from state and removes it from AsyncStorage.
 * @property {function(): Promise<void>} hydrate Attempts to load the token from AsyncStorage into the store state.
 * @property {function(string): void} setUsername Sets the username in the store state.
 * @property {function(): Promise<void>} hydrateUsername Attempts to load the username from AsyncStorage into the store state.
 * @property {function(): Promise<void>} clearUsername Clears the username from state and removes it from AsyncStorage.
 */
export interface AuthState {
  token: string | null;
  username: string;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
  hydrate: () => Promise<void>;
  setUsername: (username: string) => void;
  hydrateUsername: () => Promise<void>;
  clearUsername: () => Promise<void>;
}

/**
 * @function useAuthStore
 * @description Zustand hook/store for managing authentication state.
 * @returns {AuthState} The current authentication state and available actions.
 */
export const useAuthStore = create<AuthState>((set: any) => ({
  token: null,
  username: '', // Assuming you might want to store username as well

  /**
   * @description Sets the authentication token in the store and persists it using AsyncStorage.
   * @param {string} token The JWT or access token received upon successful login.
   * @returns {Promise<void>}
   * @sideeffect Updates store state (`token`) and writes to AsyncStorage.
   */
  setToken: async (token: string) => {
    set({ token });
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * @description Clears the authentication token from the store and removes it from AsyncStorage.
   * @returns {Promise<void>}
   * @sideeffect Updates store state (`token` to null) and removes key from AsyncStorage.
   */
  clearToken: async () => {
    set({ token: null });
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  /**
   * @description Hydrates the store state by checking if a token exists in AsyncStorage.
   * This should be called once on application startup.
   * @returns {Promise<void>}
   * @sideeffect Reads from AsyncStorage and updates store state (`token`) if a value is found.
   */
  hydrate: async () => {
    const stored = await AsyncStorage.getItem(TOKEN_KEY);
    if (stored) set({ token: stored });
  },

  /**
   * @description Sets the username in the store state. Does not persist to AsyncStorage automatically.
   * @param {string} username The user's display username.
   * @returns {void}
   * @sideeffect Updates store state (`username`).
   */
  setUsername: (username: string) => set({ username }),

  /**
   * @description Hydrates the store state by checking if a username exists in AsyncStorage.
   * @returns {Promise<void>}
   * @sideeffect Reads from AsyncStorage and updates store state (`username`) if a value is found.
   */
  hydrateUsername: async () => {
    const storedUsername = await AsyncStorage.getItem('username');
    if (storedUsername) set({ username: storedUsername });
  },

  /**
   * @description Clears the username from the store and removes it from AsyncStorage.
   * @returns {Promise<void>}
   * @sideeffect Updates store state (`username` to '') and removes key from AsyncStorage.
   */
  clearUsername: async () => {
    set({ username: '' });
    await AsyncStorage.removeItem('username');
  },
}));
