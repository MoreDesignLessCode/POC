import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import type { RootProps, RootState } from './root.model';
import { rootService } from './root.service';
import './root.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Root(props: RootProps) {
  const state = useStore<RootState>({
    loaded: false,
    ariaChecked: false,
    classes: { base: '' },
    handleClick() {
      state.ariaChecked = !state.ariaChecked;
    },
    handleKeyDown(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        state.ariaChecked = !state.ariaChecked;
      }
    }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = rootService.getClasses(props.rounded, props.className);
  });

  return (
    <Show when={state.loaded}>
      <div
        class={state.classes.base}
        role="switch"
        aria-checked={state.ariaChecked}
        tabIndex={0}
        onClick={() => state.handleClick()}
        onKeyDown={(event) => state.handleKeyDown(event)}
      >
        {props.children}
      </div>
    </Show>
  );
}
