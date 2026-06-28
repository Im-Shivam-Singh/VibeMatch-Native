// VibeMatch state store — Zustand with AsyncStorage persistence
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { VibeUser } from "./types";

interface AppState {
  // Auth
  authed: boolean;
  currentUser: VibeUser | null;
  setAuthed: (v: boolean) => void;
  setCurrentUser: (u: VibeUser | null) => void;
  login: (u: VibeUser) => void;
  logout: () => void;

  // Onboarding
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;

  // Filters
  cityFilter: string | null;
  setCityFilter: (c: string | null) => void;
  vibeFilter: string | null;
  setVibeFilter: (v: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Saved parties
  savedPartyIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;

  // Explore scope
  exploreScope: "all" | "saved";
  setExploreScope: (s: "all" | "saved") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      authed: false,
      currentUser: null,
      setAuthed: (v) => set({ authed: v }),
      setCurrentUser: (u) => set({ currentUser: u }),
      login: (u) => set({ authed: true, currentUser: u }),
      logout: () =>
        set({
          authed: false,
          currentUser: null,
          savedPartyIds: [],
        }),

      onboarded: false,
      setOnboarded: (v) => set({ onboarded: v }),

      cityFilter: null,
      setCityFilter: (c) => set({ cityFilter: c }),
      vibeFilter: null,
      setVibeFilter: (v) => set({ vibeFilter: v }),
      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),

      savedPartyIds: [],
      toggleSaved: (id) =>
        set((state) => ({
          savedPartyIds: state.savedPartyIds.includes(id)
            ? state.savedPartyIds.filter((x) => x !== id)
            : [...state.savedPartyIds, id],
        })),
      isSaved: (id) => get().savedPartyIds.includes(id),

      exploreScope: "all",
      setExploreScope: (s) => set({ exploreScope: s }),
    }),
    {
      name: "vibematch-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        savedPartyIds: state.savedPartyIds,
        onboarded: state.onboarded,
        currentUser: state.currentUser,
        authed: state.authed,
        cityFilter: state.cityFilter,
      }),
    }
  )
);
