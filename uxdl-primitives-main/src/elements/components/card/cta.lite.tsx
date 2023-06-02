import type { BaseProps } from '~/models';
import './cta.css';

export default function CTA(props: BaseProps) {
  return <div class={`uxdl-card__cta--container ${props.className}`}>{props.children}</div>;
}
