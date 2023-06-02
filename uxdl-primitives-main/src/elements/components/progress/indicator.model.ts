import type { BaseProps, BaseState } from '~/models';

export type IndicatorProps = {
  value: number;
  variant?: string;
} & BaseProps;

export type IndicatorState = {
  classes: { base: string };
} & BaseState;
