import type { BaseProps } from '~/models';
import './heading.css';

export default function Heading(props: BaseProps) {
  return <div class={`uxdl-tree__heading ${props.className}`}>{props.children}</div>;
}
