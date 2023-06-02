import type { BaseProps } from '~/models';
import './media.css';

export default function Media(props: BaseProps) {
  return <div class={`uxdl-card__media--container ${props.className}`}>{props.children}</div>;
}
