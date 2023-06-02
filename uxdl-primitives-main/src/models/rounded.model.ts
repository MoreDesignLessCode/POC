export enum Rounded {
  None = '',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export const rounded = Object.entries(Rounded).map(([key, value]: [string, string]) => ({ key, value }));
