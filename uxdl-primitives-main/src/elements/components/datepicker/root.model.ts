import type { BaseProps, BaseState } from '~/models';

export type RootProps = {
  variant?: string;
  id?: string;
  name?: string;
  initialValue?: string;
  min?: string;
  max?: string;
} & BaseProps;

export type RootState = {
  classes: { base: string };
  value: string;
} & BaseState;
