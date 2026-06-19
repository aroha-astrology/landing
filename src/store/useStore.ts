import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Slimmed store for the standalone (no-auth) landing — language only.
interface LandingState {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useStore = create<LandingState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'aroha-landing',
      partialize: (state) => ({ language: state.language }),
    },
  ),
);
