import type { BaseProps, BaseState, Dynamic, Intent, Variant } from '~/models';

export type TitleProps = {
  variant?: Dynamic<Variant>;
  intent?: Dynamic<Intent>;
  outline?: boolean;
  disabled?: boolean;
} & BaseProps;

export type TitleState = {
  classes: { base: string };
} & BaseState;
