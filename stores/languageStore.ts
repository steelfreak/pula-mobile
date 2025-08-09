import { create } from 'zustand';
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
  setSelectedSourceLanguage: (language: Language | null) => void;
  setSelectedTargetLanguage1: (language: Language | null) => void;
  setSelectedTargetLanguage2: (language: Language | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  hydrate: () => void;
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
  setSelectedSourceLanguage: (language) => {
    set({ selectedSourceLanguage: language });
    if (typeof window !== 'undefined') {
      localStorage.setItem(SELECTED_SOURCE_LANGUAGE, JSON.stringify(language));
    }
  },
  setSelectedTargetLanguage1: (language) => {
    set({ selectedTargetLanguage1: language });
    if (typeof window !== 'undefined') {
      localStorage.setItem(SELECTED_TARGET_LANGUAGE1, JSON.stringify(language));
    }
  },
  setSelectedTargetLanguage2: (language) => {
    set({ selectedTargetLanguage2: language });
    if (typeof window !== 'undefined') {
      localStorage.setItem(SELECTED_TARGET_LANGUAGE2, JSON.stringify(language));
    }
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
  hydrate: () => {
    if (typeof window !== 'undefined') {
      const storedSource = localStorage.getItem(SELECTED_SOURCE_LANGUAGE);
      const storedTarget1 = localStorage.getItem(SELECTED_TARGET_LANGUAGE1);
      const storedTarget2 = localStorage.getItem(SELECTED_TARGET_LANGUAGE2);
      
      if (storedSource) {
        set({ selectedSourceLanguage: JSON.parse(storedSource) });
      }
      if (storedTarget1) {
        set({ selectedTargetLanguage1: JSON.parse(storedTarget1) });
      }
      if (storedTarget2) {
        set({ selectedTargetLanguage2: JSON.parse(storedTarget2) });
      }
    }
  },
})); 