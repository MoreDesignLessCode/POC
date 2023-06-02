import type { BaseProps, BaseState } from '~/models';

export type RootProps = {
  variant?: string;
} & BaseProps;

export type RootState = {
  classes: { base: string };
  handleClickOutside: (target: MouseEvent) => void;
} & BaseState;
