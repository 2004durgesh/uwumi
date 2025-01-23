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
  '#ffb1c1',
  '#ece0e0',
  '#524345',
  '#322629',
  '#004d63',
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
const n2 = t([[0, 2],[1, 2],[2, 5],[3, 0],[4, 6],[5, 7],[6, 1],[7, 2],[8, 6]])

export const dark = n2
export const dark_default = n2
const n3 = t([[0, 8],[1, 8],[2, 9],[3, 10],[4, 11],[5, 12],[6, 9],[7, 8],[8, 11]])

export const light_cloudflare = n3
const n4 = t([[0, 13],[1, 13],[2, 14],[3, 15],[4, 16],[5, 17],[6, 18],[7, 13],[8, 16]])

export const light_cottonCandy = n4
const n5 = t([[0, 10],[1, 10],[2, 9],[3, 8],[4, 19],[5, 20],[6, 9],[7, 10],[8, 19]])

export const dark_cloudflare = n5
const n6 = t([[0, 15],[1, 15],[2, 21],[3, 22],[4, 23],[5, 24],[6, 25],[7, 15],[8, 23]])

export const dark_cottonCandy = n6