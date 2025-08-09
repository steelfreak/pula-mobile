// for tab state

import { create } from 'zustand';

export interface AppState {
  activeTab: 'source' | 'target1' | 'target2';

  // Actions
  setActiveTab: (tab: 'source' | 'target1' | 'target2') => void;
}

// Actions
// setActiveTab: (tab: 'source' | 'target1' | 'target2') => set({ activeTab: tab }),
export const useAppStore = create<AppState>((set: any) => ({
  activeTab: 'source',
  setActiveTab: (tab: 'source' | 'target1' | 'target2') => set({ activeTab: tab }),
}));
