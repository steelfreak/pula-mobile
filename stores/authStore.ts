import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = 'auth_token';

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

export const useAuthStore = create<AuthState>((set: any) => ({
  token: null,
  username: '', // Assuming you might want to store username as well
  setToken: async (token: string) => {
    set({ token });
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  clearToken: async () => {
    set({ token: null });
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
  hydrate: async () => {
    const stored = await AsyncStorage.getItem(TOKEN_KEY);
    if (stored) set({ token: stored });
  },

  setUsername: (username: string) => set({ username }),

  hydrateUsername: async () => {
    const storedUsername = await AsyncStorage.getItem('username');
    if (storedUsername) set({ username: storedUsername });
  },

  clearUsername: async () => {
    set({ username: '' });
    await AsyncStorage.removeItem('username');
  },
})); 