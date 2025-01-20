import { createThemeBuilder } from '@tamagui/theme-builder';
// palettes array should be in form [accentBackground,background, color, color2, color3, color4, color5, color6]
const palettes = {
  light: [
    '#fefbff', //background,accentColor  0
    '#0058ca', // Primary color          1
    '#1b1b1f', //color1                  2
    '#6a6a71', //color2,borderColor      3
    '#c5c6d0', //color3                  4
    '#b0c6ff', //color4                  5
    '#006e1b', //color5                  6
  ],
  dark: ['#000000', '#b0c6ff', '#ffffff', '#b4b5b9', '#44464f', '#0058ca', '#7adc77'],
  light_cloudflare: ['#eff2f5', '#1b1b22', '#f38020', '#1b1b22', '#5a5666', '#cac4d0', '#f38020'],
  dark_cloudflare: ['#000000', '#eff2f5', '#f38020', '#ffffff', '#b2b2b5', '#49454f', '#f38020'],
  light_cotton_candy: ['#fffbff', '#9a4058', '#201a1b', '#74686a', '#cac4d0', '#5bcefa', '#9a4058'],
  dark_cotton_candy: ['#000000', '#ffb1c1', '#ffffff', '#bab4b5', '#49454f', '#004d63', '#ffb1c1'],
};
const templates = {
  light_base: {
    accentBackground: 0,
    accentColor: 0,
    color: 1,
    color1: 2,
    color2: 3,
    color3: 4,
    color4: 5,
    color5: 6,
    background: 0,
    borderColor: 3,
  },
  dark_base: {
    accentBackground: 0,
    accentColor: 0,
    color: 1,
    color1: 2,
    color2: 3,
    color3: 4,
    color4: 5,
    color5: 6,
    background: 0,
    borderColor: 3,
  },
};

export const themes = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(templates)
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
    },
    dark: {
      template: 'base',
      palette: 'dark',
    },
  })
  .addChildThemes({
    default: [
      {
        parent: 'light',
        template: 'base',
        palette: 'light',
      },
      {
        parent: 'dark',
        template: 'base',
        palette: 'dark',
      },
    ],
    cloudflare: [
      {
        parent: 'light',
        template: 'base',
        palette: 'light_cloudflare',
      },
      {
        parent: 'dark',
        template: 'base',
        palette: 'dark_cloudflare',
      },
    ],
    cottonCandy: [
      {
        parent: 'light',
        template: 'base',
        palette: 'light_cotton_candy',
      },
      {
        parent: 'dark',
        template: 'base',
        palette: 'dark_cotton_candy',
      },
    ],
  })
  .build();
