import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageId } from "@/types/learning";

type LanguageState = {
  selectedLanguageId: LanguageId | null;
  hasHydrated: boolean;
  setSelectedLanguage: (languageId: LanguageId) => void;
  clearAsyncStorage: () => Promise<void>;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      hasHydrated: false,
      setSelectedLanguage: (languageId) => {
        set({ selectedLanguageId: languageId });
      },
      clearAsyncStorage: async () => {
        await AsyncStorage.clear();
        set({ selectedLanguageId: null });
      },
      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedLanguageId: state.selectedLanguageId,
      }),
      onRehydrateStorage: (state) => () => {
        state.setHasHydrated(true);
      },
    },
  ),
);
