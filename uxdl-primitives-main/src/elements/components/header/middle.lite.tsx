import type { BaseProps } from '~/models';
import './middle.css';

export default function Middle(props: BaseProps) {
  return <div class={`uxdl-header__middle ${props.className}`}>{props.children}</div>;
}
