import { themes } from '@/constants/Theme';
import { useThemeStore, useAccentStore } from '@/hooks';

export const useCurrentTheme = () => {
  const themeName = useThemeStore((state) => state.themeName);
  const accentName = useAccentStore((state) => state.accentName);
  const key = `${themeName}_${accentName}`;
  //   @ts-ignore
  return themes[key];
};
