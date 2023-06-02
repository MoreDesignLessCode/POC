export enum Sides {
  Auto = '',
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom'
}

export const sides = Object.entries(Sides).map(([key, value]: [string, string]) => ({ key, value }));
