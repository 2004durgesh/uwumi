type Theme = {
  accentBackground: string;
  accentColor: string;
  color: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  background: string;
  borderColor: string;
};

function t(a: [number, number][]) {
  let res: Record<string, string> = {};
  for (const [ki, vi] of a) {
    res[ks[ki] as string] = vs[vi] as string;
  }
  return res as Theme;
}
const vs = [
  '#fefbff',
  '#0058ca',
  '#1b1b1f',
  '#6a6a71',
  '#c5c6d0',
  '#b0c6ff',
  '#006e1b',
  '#000000',
  '#ffffff',
  '#b4b5b9',
  '#44464f',
  '#7adc77',
  '#eff2f5',
  '#f38020',
  '#1b1b22',
  '#5a5666',
  '#cac4d0',
  '#fffbff',
  '#9a4058',
  '#201a1b',
  '#74686a',
  '#5bcefa',
  '#b2b2b5',
  '#49454f',
  '#ffb1c1',
  '#bab4b5',
  '#004d63',
];

const ks = [
  'accentBackground',
  'accentColor',
  'color',
  'color1',
  'color2',
  'color3',
  'color4',
  'color5',
  'background',
  'borderColor',
];

const n1 = t([
  [0, 0],
  [1, 0],
  [2, 1],
  [3, 2],
  [4, 3],
  [5, 4],
  [6, 5],
  [7, 6],
  [8, 0],
  [9, 3],
]);

export const light = n1;
export const light_default = n1;
const n2 = t([
  [0, 7],
  [1, 7],
  [2, 5],
  [3, 8],
  [4, 9],
  [5, 10],
  [6, 1],
  [7, 11],
  [8, 7],
  [9, 9],
]);

export const dark = n2;
export const dark_default = n2;
const n3 = t([
  [0, 12],
  [1, 12],
  [2, 13],
  [3, 14],
  [4, 15],
  [5, 16],
  [6, 13],
  [7, 12],
  [8, 12],
  [9, 15],
]);

export const light_cloudflare = n3;
const n4 = t([
  [0, 17],
  [1, 17],
  [2, 18],
  [3, 19],
  [4, 20],
  [5, 16],
  [6, 21],
  [7, 18],
  [8, 17],
  [9, 20],
]);

export const light_cottonCandy = n4;
const n5 = t([
  [0, 7],
  [1, 7],
  [2, 13],
  [3, 8],
  [4, 22],
  [5, 23],
  [6, 13],
  [7, 14],
  [8, 7],
  [9, 22],
]);

export const dark_cloudflare = n5;
const n6 = t([
  [0, 7],
  [1, 7],
  [2, 24],
  [3, 8],
  [4, 25],
  [5, 23],
  [6, 26],
  [7, 24],
  [8, 7],
  [9, 25],
]);

export const dark_cottonCandy = n6;
