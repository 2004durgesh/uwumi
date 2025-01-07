import { createTamagui, createFont } from 'tamagui';
import { createAnimations } from '@tamagui/animations-react-native';
import * as themes from '@/constants/theme-out';
import { tokens } from '@tamagui/config/v3';

const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 15,
    mass: 1,
    stiffness: 150,
  },
  lazy: {
    type: 'spring',
    damping: 25,
    mass: 1,
    stiffness: 120,
  },
  quick: {
    type: 'spring',
    damping: 30,
    mass: 0.8,
    stiffness: 300,
  },
});

const fonts = {
  heading: createFont({
    family: 'Inter',
    size: {
      1: 32,
      2: 24,
      3: 20,
      4: 16,
    },
    weight: {
      1: '800',
      2: '600',
      3: '500',
      4: '400',
    },
    letterSpacing: {
      1: -0.5,
      2: -0.3,
      3: -0.2,
      4: 0,
    },
    face: {
      800: { normal: 'InterBold' },
      600: { normal: 'InterSemiBold' },
      500: { normal: 'InterMedium' },
      400: { normal: 'InterRegular' },
    },
  }),
  body: createFont({
    family: 'Inter',
    size: {
      1: 16,
      2: 14,
      3: 12,
      4: 10,
    },
    weight: {
      1: '600',
      2: '500',
      3: '400',
      4: '300',
    },
    letterSpacing: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    },
    face: {
      600: { normal: 'InterSemiBold' },
      500: { normal: 'InterMedium' },
      400: { normal: 'InterRegular' },
      300: { normal: 'InterLight' },
    },
  }),
};

const config = createTamagui({
  tokens,
  themes,
  animations,
  fonts,
  // ...the rest of your config
});

export default config;
