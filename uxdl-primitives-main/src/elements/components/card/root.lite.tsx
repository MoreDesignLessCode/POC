import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import './root.css';
import type { RootProps, RootState } from './root.model';
import { rootService } from './root.service';

useMetadata({ isAttachedToShadowDom: true });

export default function Root(props: RootProps) {
  const state = useStore<RootState>({
    loaded: false,
    classes: { base: '' }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = rootService.getClasses(props.rounded, props.className);
  });

  return (
    <Show when={state.loaded}>
      <div class={state.classes.base}>{props.children}</div>
    </Show>
  );
}
