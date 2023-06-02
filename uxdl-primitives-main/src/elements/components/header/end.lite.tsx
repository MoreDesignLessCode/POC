import type { BaseProps } from '~/models';
import './end.css';

export default function End(props: BaseProps) {
  return <div class={`uxdl-header__end ${props.className}`}>{props.children}</div>;
}
