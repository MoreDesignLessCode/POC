import type { BaseProps, BaseState } from '~/models';

export type RootProps = {
  outline?: boolean;
} & BaseProps;

export type RootState = {
  classes: { base: string };
} & BaseState;
