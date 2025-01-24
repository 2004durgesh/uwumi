import { themes } from '@/constants/Theme';
import { useAccentStore } from './stores/useAccentStore';
import { useThemeStore } from './stores/useThemeStore';

export const useCurrentTheme = () => {
  const themeName = useThemeStore((state) => state.themeName);
  const accentName = useAccentStore((state) => state.accentName);
  const key = `${themeName}_${accentName}`;
  //   @ts-ignore
  return themes[key];
};
