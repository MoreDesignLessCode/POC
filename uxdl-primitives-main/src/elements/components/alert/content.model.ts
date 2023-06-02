import type { BaseProps, BaseState } from '~/models';

export type ContentProps = {
  outline?: boolean;
} & BaseProps;

export type ContentState = {
  classes: { base: string };
} & BaseState;
