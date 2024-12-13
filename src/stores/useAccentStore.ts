import { create } from "zustand";
import { storage } from "@/stores/MMKV";

type AccentName = string | null ;

interface AccentState {
  accentName: AccentName;
  setAccentName: (name: AccentName) => void;
}

const getInitialAccent = (): AccentName => {
  const saved = storage.getString("accent");
  return saved ? (saved as AccentName) : "default";
};

export const useAccentStore = create<AccentState>((set) => ({
  accentName: getInitialAccent(),
  setAccentName: (name) => {
    if (name !== null) {
      storage.set("accent", name);
    }
    set({ accentName: name });
  },
}));
