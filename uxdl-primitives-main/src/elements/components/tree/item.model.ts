import type { BaseProps, BaseState } from '~/models';

export type ItemProps = {
  variant?: string;
} & BaseProps;

export type ItemState = {
  classes: { base: string };
} & BaseState;
