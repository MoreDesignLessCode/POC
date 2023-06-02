
import type { BaseProps, BaseState } from '~/models';

export type RootProps = {
  variant?: string;
  language?: string
  source?: string
} & BaseProps;

export type RootState = {
  classes: { base: string };
} & BaseState;


