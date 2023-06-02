import type { BaseProps, BaseState } from '~/models';

export type RootProps = {
  variant?: string;
  sticky?: boolean;
} & BaseProps;

export type RootState = {
  classes: { base: string };
  handleBurgerClick: () => void;
  startMiddleEnd: [];
  navbar: [];
} & BaseState;
