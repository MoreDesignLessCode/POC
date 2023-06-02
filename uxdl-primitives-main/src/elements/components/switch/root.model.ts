import type { BaseProps, BaseState } from '~/models';

export type RootProps = {
  outline?: boolean;
} & BaseProps;

export type RootState = {
  ariaChecked: boolean;
  classes: { base: string };
  handleClick: () => void;
  handleKeyDown: (event: KeyboardEvent) => void;
} & BaseState;
