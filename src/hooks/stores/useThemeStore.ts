import { create } from 'zustand';
import { storage } from '@/hooks/stores/MMKV';

type ThemeName = 'light' | 'dark';

interface ThemeState {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}

const getInitialTheme = (): ThemeName => {
  const saved = storage.getString('theme');
  return saved ? (saved as ThemeName) : 'dark';
};

export const useThemeStore = create<ThemeState>((set) => ({
  themeName: getInitialTheme(),
  setThemeName: (name) => {
    storage.set('theme', name);
    set({ themeName: name });
  },
}));
