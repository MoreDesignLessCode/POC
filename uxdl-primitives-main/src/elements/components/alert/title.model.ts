import type { BaseProps, BaseState, Dynamic, Intent, Variant } from '~/models';

export type TitleProps = {
  variant?: Dynamic<Variant>;
} & BaseProps;

export type TitleState = {
  classes: { base: string };
} & BaseState;
