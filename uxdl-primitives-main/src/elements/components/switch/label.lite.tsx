import './label.css';
import type { BaseProps } from '~/models';

export default function Label(props: BaseProps) {
  return <span class={`label ${props.className}`}>{props.children}</span>;
}
