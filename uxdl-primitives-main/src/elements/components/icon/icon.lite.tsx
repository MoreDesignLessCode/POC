import type { BaseProps } from '~/models';
import './icon.css';

export default function Icon(props: BaseProps) {
  return <i class={props.className}>{props.children}</i>;
}
