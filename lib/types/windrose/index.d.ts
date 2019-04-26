declare module 'windrose' {
  interface Options {
    depth: 0 | 1 | 2 | 3;
  }

  interface Point {
    symbol: string;
    name: string;
    depth: number;
  }

  interface Degrees {
    min: number;
    value: number;
    max: number;
  }

  export function getPoint(degrees: number, opts?: Options): Point | undefined;

  export function getDegrees(name: string, opts?: Options): Degrees | undefined;
}
