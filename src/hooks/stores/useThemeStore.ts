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

interface PureBlackState {
  pureBlackBackground: boolean;
  setPureBlackBackground: (value: boolean) => void;
}

const getInitialPureBlack = (): boolean => {
  const saved = storage.getString('pureBlack');
  return saved ? saved === 'true' : false;
};

export const usePureBlackBackground = create<PureBlackState>((set) => ({
  pureBlackBackground: getInitialPureBlack(),
  setPureBlackBackground: (value: boolean) => {
    storage.set('pureBlack', value.toString());
    set({ pureBlackBackground: value });
  },
}));
