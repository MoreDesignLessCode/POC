import type { BaseProps, BaseState, Dynamic, Variant } from '~/models';

export type RootProps = {
  variant?: Dynamic<Variant>; // unused but leading for now
} & BaseProps;

export type RootState = {
  alertActive: boolean;
  handleClick: (event: MouseEvent | KeyboardEvent) => void;
  trigger: [];
  content: [];
  overlay: [];
} & BaseState;
