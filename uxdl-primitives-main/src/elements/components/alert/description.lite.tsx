import type { BaseProps } from '~/models';
import './description.css';

export default function Description(props: BaseProps) {
  return <div class={`uxdl-alert__description ${props.className}`}>{props.children}</div>;
}
