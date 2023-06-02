import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import './title.css';
import type { TitleProps, TitleState } from './title.model';
import { titleService } from './title.service';

useMetadata({ isAttachedToShadowDom: true });

export default function Title(props: TitleProps) {
  const state = useStore<TitleState>({
    loaded: false,
    classes: { base: '' }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = titleService.getClasses(props.variant, props.className);
  });

  return (
    <Show when={state.loaded}>
      <div class={state.classes.base}>{props.children}</div>
    </Show>
  );
}
