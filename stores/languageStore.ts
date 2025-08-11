import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types/api';
import { SELECTED_SOURCE_LANGUAGE, SELECTED_TARGET_LANGUAGE1, SELECTED_TARGET_LANGUAGE2 } from '../lib/constants';

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

export const useLanguageStore = create<LanguageState>((set) => ({
  languages: [],
  selectedSourceLanguage: null,
  selectedTargetLanguage1: null,
  selectedTargetLanguage2: null,
  loading: false,
  error: null,
  showSelectLanguageModal: false,
  setShowSelectLanguageModal: (show) => set({ showSelectLanguageModal: show }),
  
  setLanguages: (languages) => set({ languages }),
  setSelectedSourceLanguage: async (language) => {
    set({ selectedSourceLanguage: language });
    await AsyncStorage.setItem(SELECTED_SOURCE_LANGUAGE, JSON.stringify(language));
  },
  setSelectedTargetLanguage1: async (language) => {
    set({ selectedTargetLanguage1: language });
    await AsyncStorage.setItem(SELECTED_TARGET_LANGUAGE1, JSON.stringify(language));
  },
  setSelectedTargetLanguage2: async (language) => {
    set({ selectedTargetLanguage2: language });
    await AsyncStorage.setItem(SELECTED_TARGET_LANGUAGE2, JSON.stringify(language));
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({
    languages: [],
    selectedSourceLanguage: null,
    selectedTargetLanguage1: null,
    selectedTargetLanguage2: null,
    loading: false,
    error: null,
  }),
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