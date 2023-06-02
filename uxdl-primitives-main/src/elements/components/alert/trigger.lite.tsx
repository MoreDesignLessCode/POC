import { useMetadata, Show, onMount, useStore } from '@builder.io/mitosis';
import type { BaseProps } from '~/models';
import './trigger.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Trigger(props: BaseProps) {
  const state = useStore({
    loaded: false
  });

  onMount(() => {
    state.loaded = true;
  });

  return (
    <Show when={state.loaded}>
      <div class={`uxdl-alert__trigger ${props.className}`}>{props.children}</div>
    </Show>
  );
}
