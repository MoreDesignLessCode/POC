import type { BaseProps } from '~/models';
import './root.css';

export default function Root(props: BaseProps) {
  return (
    <div class={`uxdl-tooltip__root ${props.className}`} tabIndex={0}>
      {props.children}
    </div>
  );
}
