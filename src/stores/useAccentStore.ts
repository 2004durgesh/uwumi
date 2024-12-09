import { create } from "zustand";

interface AccentState {
  accentName: string | null | undefined;
  setAccentName: (name: string | null | undefined) => void;
}

const useAccentStore = create<AccentState>((set) => ({
  accentName: "",
  setAccentName: (name: string | null | undefined) => set({ accentName: name }),
}));

export default useAccentStore;
