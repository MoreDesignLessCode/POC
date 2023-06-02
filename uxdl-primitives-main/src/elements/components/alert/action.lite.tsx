import type { BaseProps } from '~/models';
import './action.css';

export default function Action(props: BaseProps) {
  return <div class={`uxdl-alert__action ${props.className}`}>{props.children}</div>;
}
