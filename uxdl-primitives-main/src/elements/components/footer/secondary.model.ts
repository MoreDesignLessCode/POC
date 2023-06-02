import type { BaseProps, BaseState } from '~/models';

export type SecondaryProps = {
  variant?: string;
} & BaseProps;

export type SecondaryState = {
  classes: { base: string };
} & BaseState;
