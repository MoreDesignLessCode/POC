import type { BaseProps } from '~/models';
import './trigger.css';

export default function Trigger(props: BaseProps) {
  return <div class={`uxdl-tooltip__trigger ${props.className}`}>{props.children}</div>;
}
