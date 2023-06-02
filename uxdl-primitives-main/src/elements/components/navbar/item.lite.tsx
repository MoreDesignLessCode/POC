import type { BaseProps } from '~/models';
import './item.css';

export default function Item(props: BaseProps) {
  return <li class={`uxdl-navbar__item  ${props.className}`}>{props.children}</li>;
}
