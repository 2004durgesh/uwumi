type Theme = {
  accentBackground: string;
  accentColor: string;
  color: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  background: string;
  borderColor: string;

}

function t(a: [number, number][]) {
  let res: Record<string,string> = {}
  for (const [ki, vi] of a) {
    res[ks[ki] as string] = vs[vi] as string
  }
  return res as Theme
}
const vs = [
  '#fefbff',
  '#0058ca',
  '#1b1b1f',
  '#6a6a71',
  '#e9eefb',
  '#b0c6ff',
  '#44464f',
  '#272931',
  '#0e1015',
  '#eff2f5',
  '#f38020',
  '#1b1b22',
  '#cac4d0',
  '#efe9e3',
  '#fffbff',
  '#9a4058',
  '#201a1b',
  '#f3dde0',
  '#f7ecf1',
  '#5bcefa',
  '#49454f',
  '#2d2322',
  '#140b03',
  '#ffb1c1',
  '#ece0e0',
  '#524345',
  '#322629',
  '#004d63',
  '#150f10',
]

const ks = [
'accentBackground',
'accentColor',
'color',
'color1',
'color2',
'color3',
'color4',
'background',
'borderColor']


const n1 = t([[0, 0],[1, 0],[2, 1],[3, 2],[4, 3],[5, 4],[6, 5],[7, 0],[8, 3]])

export const light = n1
export const light_default = n1
const n2 = t([[0, 2],[1, 2],[2, 5],[3, 0],[4, 6],[5, 7],[6, 1],[-1, 8],[7, 2],[8, 6]])

export const dark = n2
export const dark_default = n2
const n3 = t([[0, 9],[1, 9],[2, 10],[3, 11],[4, 12],[5, 13],[6, 10],[7, 9],[8, 12]])

export const light_cloudflare = n3
const n4 = t([[0, 14],[1, 14],[2, 15],[3, 16],[4, 17],[5, 18],[6, 19],[7, 14],[8, 17]])

export const light_cottonCandy = n4
const n5 = t([[0, 11],[1, 11],[2, 10],[3, 9],[4, 20],[5, 21],[6, 10],[-1, 22],[7, 11],[8, 20]])

export const dark_cloudflare = n5
const n6 = t([[0, 16],[1, 16],[2, 23],[3, 24],[4, 25],[5, 26],[6, 27],[-1, 28],[7, 16],[8, 25]])

export const dark_cottonCandy = n6