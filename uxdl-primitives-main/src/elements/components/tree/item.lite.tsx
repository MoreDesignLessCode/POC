import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import type { ItemProps, ItemState } from './item.model';
import { itemService } from './item.service';
import './item.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Item(props: ItemProps) {
  const state = useStore<ItemState>({
    loaded: false,
    classes: { base: '' }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = itemService.getClasses(props.variant, props.className);
  });

  return (
    <Show when={state.loaded}>
      <li class={state.classes.base}>{props.children}</li>
    </Show>
  );
}
