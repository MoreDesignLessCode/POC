import { onMount, onUnMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import type { RootProps, RootState } from './root.model';
import { rootService } from './root.service';
import './root.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Root(props: RootProps) {
  const state = useStore<RootState>({
    loaded: false,
    classes: { base: '' },
    handleClickOutside({ target }: MouseEvent) {
      if (document.body.classList.contains('nav-open')) {
        if (
          !(target as Element).classList.contains('uxdl-header__burger') &&
          !(target as Element).classList.contains('uxdl-header__burger--icon') &&
          !(target as Element).classList.contains('uxdl-navbar__root') &&
          !(target as Element).classList.contains('uxdl-navbar__item')
        ) {
          document.body.classList.remove('nav-open');
        }
      }
    }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = rootService.getClasses(props.variant, props.className);

    document.addEventListener('click', (event) => state.handleClickOutside(event), true);

    window.addEventListener(
      'resize',
      function () {
        if (window.innerWidth > 1023 && document.body.classList.contains('nav-open')) {
          document.body.classList.remove('nav-open');
        }
      },
      true
    );
  });

  onUnMount(() => {
    document.removeEventListener('click', state.handleClickOutside, true);
  });

  return (
    <Show when={state.loaded}>
      <ul className={state.classes.base}>{props.children}</ul>
    </Show>
  );
}
