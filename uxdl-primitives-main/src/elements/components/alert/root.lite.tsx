import { useMetadata, Show, onMount, useStore } from '@builder.io/mitosis';
import type { RootProps, RootState } from './root.model';
import './root.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Root(props: RootProps) {
  const state = useStore<RootState>({
    loaded: false,
    alertActive: false,
    handleClick(event) {
      if ((event.target as Element).parentElement.classList.contains('uxdl-alert__trigger')) {
        state.alertActive = !state.alertActive;
        if (state.alertActive) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'unset';
        }
      } else if (
        (event.target as Element).parentElement.classList.contains('uxdl-alert__cancel') ||
        (event.target as Element).classList.contains('uxdl-alert__content--close')
      ) {
        state.alertActive = false;
        document.body.style.overflow = 'unset';
      }
    },
    trigger: [],
    content: [],
    overlay: []
  });

  onMount(() => {
    state.loaded = true;
    state.trigger = props.children.filter((child) => child.type.name.includes('Trigger'));
    state.content = props.children.filter((child) => child.type.name.includes('Content'));
    state.overlay = props.children.filter((child) => child.type.name.includes('Overlay'));
  });

  return (
    <Show when={state.loaded}>
      <div class={`uxdl-alert__root ${props.className}`} onClick={(event) => state.handleClick(event)}>
        {state.trigger}
        <div style={{ display: `${state.alertActive ? 'block' : 'none'}` }}>{state.content}</div>
        <div style={{ display: `${state.alertActive ? 'block' : 'none'}` }} onClick={() => (state.alertActive = false)}>
          {state.overlay}
        </div>
      </div>
    </Show>
  );
}
