import type { BaseProps, BaseState } from '~/models';

export type TriggerProps = {
  variant?: string;
  rotate?: string;
} & BaseProps;

export type TriggerState = {
  classes: { base: string };
  handleTriggerClick: (event) => void;
  handleTriggerKeyDown: (event) => void;
} & BaseState;
