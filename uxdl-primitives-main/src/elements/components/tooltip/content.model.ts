import type { BaseProps, BaseState } from '~/models';

export type ContentProps = {
  side?: string;
  variant?: string;
} & BaseProps;

export type ContentState = {
  classes: { base: string };
} & BaseState;
