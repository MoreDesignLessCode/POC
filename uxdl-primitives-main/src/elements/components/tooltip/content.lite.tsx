import { onMount, Show, useMetadata, useStore } from '@builder.io/mitosis';
import type { ContentProps, ContentState } from './content.model';
import { contentService } from './content.service';
import './content.css';

useMetadata({ isAttachedToShadowDom: true });

export default function Content(props: ContentProps) {
  const state = useStore<ContentState>({
    loaded: false,
    classes: { base: '' }
  });

  onMount(() => {
    state.loaded = true;
    state.classes = contentService.getClasses(props.side, props.className);
  });

  return (
    <Show when={state.loaded}>
      <div class={state.classes.base}>{props.children}</div>
    </Show>
  );
}
