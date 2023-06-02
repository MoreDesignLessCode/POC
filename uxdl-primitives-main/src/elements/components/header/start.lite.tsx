import type { BaseProps } from '~/models';
import './start.css';

export default function Start(props: BaseProps) {
  return <div class={`uxdl-header__start ${props.className}`}>{props.children}</div>;
}
