import { createTamagui } from 'tamagui'
import { createAnimations } from '@tamagui/animations-react-native';
import * as themes from '@/constants/theme-out'
import { tokens } from '@tamagui/config/v3'


const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
});

const config = createTamagui({
  tokens,
  themes,
  animations,
  // ...the rest of your config
})

export default config
