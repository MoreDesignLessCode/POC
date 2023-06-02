import type { BaseProps, BaseState } from '~/models';

export type CheckboxProps = {
  variant?: string;
  id?: string;
  name?: string;
  value?: string;
} & BaseProps;

export type CheckboxState = {
  classes: { base: string };
  handleCheckboxCheck: (event) => void;
  handleCheckboxKeyDown: (event) => void;
} & BaseState;
