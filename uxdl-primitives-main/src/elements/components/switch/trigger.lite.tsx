import type { TriggerProps } from './trigger.model';
import './trigger.css';

export default function Trigger(props: TriggerProps) {
  return (
    <span
      class={`switch uxdl-switch__trigger ${props.rounded ? 'uxdl__border-radius--' + props.rounded : ''} ${
        props.variant ? 'uxdl-switch__trigger--' + props.variant : ''
      } ${props.className}`}
    >
      <span
        class={`thumb ${props.rounded ? 'uxdl__border-radius--' + props.rounded : ''} ${
          props.variant ? 'uxdl-switch__trigger--' + props.variant : ''
        }`}
      ></span>
    </span>
  );
}
