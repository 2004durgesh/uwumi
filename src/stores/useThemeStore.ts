import { create } from 'zustand';

interface ThemeState {
  themeName: 'light' | 'dark' | undefined;
  setThemeName: (name: 'light' | 'dark' | undefined) => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  themeName: 'dark',
  setThemeName: (name: 'light' | 'dark' | undefined) => set({ themeName: name }),
}));

export default useThemeStore;