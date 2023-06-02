import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import type { RootProps, RootState } from './root.model';
import { rootService } from './root.service';
import './root.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Root(props: RootProps) {
  const state = useStore<RootState>({
    loaded: false,
    classes: { base: '' },
    handleBurgerClick() {
      document.body.classList.toggle('nav-open');
    },
    startMiddleEnd: [],
    navbar: []
  });

  onMount(() => {
    state.loaded = true;
    state.classes = rootService.getClasses(props.variant, props.sticky, props.className);
    state.startMiddleEnd = props.children.filter((child) => !child.type.name.includes('Root'));
    state.navbar = props.children.filter((child) => child.type.name.includes('Root'));
  });

  return (
    <Show when={state.loaded}>
      <header class={state.classes.base}>
        <div class="uxdl-header__root--top">
          <div class="uxdl-header__burger" onClick={() => state.handleBurgerClick()}>
            <span class="uxdl-header__burger--icon"></span>
          </div>
          {state.startMiddleEnd}
        </div>
        {state.navbar}
      </header>
    </Show>
  );
}
