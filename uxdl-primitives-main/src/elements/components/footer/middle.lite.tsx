import type { BaseProps } from '~/models';
import './middle.css';

export default function Middle(props: BaseProps) {
  return <div class={`uxdl-footer__middle ${props.className}`}>{props.children}</div>;
}
