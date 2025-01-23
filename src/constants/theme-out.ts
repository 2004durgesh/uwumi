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
  '#e9eefb',
  '#b0c6ff',
  '#006e1b',
  '#b4b5b9',
  '#272931',
  '#7adc77',
  '#eff2f5',
  '#1b1b22',
  '#f38020',
  '#5a5666',
  '#cac4d0',
  '#fffbff',
  '#9a4058',
  '#201a1b',
  '#74686a',
  '#f7ecf1',
  '#5bcefa',
  '#ffffff',
  '#b2b2b5',
  '#49454f',
  '#ffb1c1',
  '#bab4b5',
  '#322629',
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
  [0, 2],
  [1, 2],
  [2, 5],
  [3, 0],
  [4, 7],
  [5, 8],
  [6, 1],
  [7, 9],
  [8, 2],
  [9, 7],
]);

export const dark = n2;
export const dark_default = n2;
const n3 = t([
  [0, 10],
  [1, 10],
  [2, 11],
  [3, 12],
  [4, 11],
  [5, 13],
  [6, 14],
  [7, 12],
  [8, 10],
  [9, 11],
]);

export const light_cloudflare = n3;
const n4 = t([
  [0, 15],
  [1, 15],
  [2, 16],
  [3, 17],
  [4, 18],
  [5, 19],
  [6, 20],
  [7, 16],
  [8, 15],
  [9, 18],
]);

export const light_cottonCandy = n4;
const n5 = t([
  [0, 11],
  [1, 11],
  [2, 10],
  [3, 12],
  [4, 21],
  [5, 22],
  [6, 23],
  [7, 12],
  [8, 11],
  [9, 21],
]);

export const dark_cloudflare = n5;
const n6 = t([
  [0, 17],
  [1, 17],
  [2, 24],
  [3, 21],
  [4, 25],
  [5, 26],
  [6, 27],
  [7, 24],
  [8, 17],
  [9, 25],
]);

export const dark_cottonCandy = n6;
