import type { BaseProps } from '~/models';
import './section.css';

export default function Section(props: BaseProps) {
  return <div className={`uxdl-secondary-footer__section ${props.className}`}>{props.children}</div>;
}
